using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.Qr;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Services.Service;

public class VatReturnService : IVatReturnService
{
    private static JsonSerializerOptions JsonOptions => new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true,
        NumberHandling = JsonNumberHandling.AllowReadingFromString,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    private readonly AccountingDatabase _database;
    private readonly StiVatReturn _stiVatReturn;
    private readonly IStiVatReturnClientService _stiVatReturnClientService;
    private readonly IVatReturnValidator _validator;

    public VatReturnService(
        AccountingDatabase database,
        StiVatReturn stiVatReturn,
        IStiVatReturnClientService stiVatReturnClientService,
        IVatReturnValidator validator
    )
    {
        _database = database;
        _stiVatReturn = stiVatReturn;
        _stiVatReturnClientService = stiVatReturnClientService;
        _validator = validator;
    }

    private async Task ConsumeSubmitDeclarationResponse(
        StiVatReturnDeclaration declaration,
        SubmitDeclarationResponse response,
        bool isCreatedNow
    )
    {
        if (response.DeclarationState == null)
        {
            throw new ValidationException(
                response.Errors
                    .Select(e => e.Description)
                    .ToList()
            );
        }

        declaration.State = response.DeclarationState;
        declaration.SubmitDate = response.ResultDate.ToUniversalTime();

        if (isCreatedNow)
        {
            declaration = (await _database.StiVatReturnDeclarations.AddAsync(declaration)).Entity;
        }
        else
        {
            _database.Update(declaration);
        }

        _database.RemoveRange(declaration.QrCodes);

        declaration.QrCodes.Clear();

        var qrCodes = GenerateQrCodes(declaration);

        foreach (var qrCode in qrCodes)
        {
            declaration.QrCodes.Add(
                new()
                {
                    Declaration = declaration,
                    DeclarationId = declaration.Id,
                    Value = qrCode
                }
            );
        }

        await _database.SaveChangesAsync();

        if (response.DeclarationState == SubmitDeclarationState.REJECTED)
        {
            throw new ValidationException(
                response.Errors
                    .Select(e => e.Description)
                    .ToList(),
                InternalFailure.VatReturnDeclarationSubmitRejectedButUpdated
            );
        }
    }

    // Returns declaration and mark whether it is freshly created
    private async Task<(StiVatReturnDeclaration, bool)> ResolveDeclarationAsync(StiVatReturnDeclarationSubmitRequest request)
    {
        var isCreatedNow = !await _database.StiVatReturnDeclarations.AnyAsync(it => it.SaleId == request.Sale.Id);
        
        var declaration = !isCreatedNow
            ? await _database.StiVatReturnDeclarations
                .Include(it => it.QrCodes)
                .FirstAsync(d => d.SaleId == request.Sale.Id)
            : new();

        if (isCreatedNow)
        {
            declaration.Id = await GenerateDeclarationIdAsync();
            declaration.DeclaredById = request.RequesterId;
            declaration.InstanceId = request.InstanceId;
        }

        declaration.Correction += 1;

        declaration.Sale = await _database.Sales
            .Include(it => it.Customer)
            .ThenInclude(it => it.OtherDocuments)
            .Include(it => it.Salesman)
            .Include(it => it.SoldGoods)
            .FirstAsync(s => s.Id == request.Sale.Id);

        return (declaration, isCreatedNow);
    }

    public async Task<string> GenerateDeclarationIdAsync()
    {
        var nextId = await _database.StiVatReturnDeclarations.CountAsync() + 1;

        return $"{_stiVatReturn.Intermediary.Id}/VAT.R/{nextId}";
    }

    public IEnumerable<string> GenerateQrCodes(StiVatReturnDeclaration declaration)
    {
        var qrCodeDeclaration = declaration.ToQrCodeDocument();

        var json = QrGeneratorUtil.CleanUpBeforeGenerating(
            JsonSerializer.Serialize(qrCodeDeclaration, JsonOptions)
        );

        var chunks = QrGeneratorUtil.CreateQrCodeEnvelopeChunks(json);

        var qrCodes = chunks
            .Select(
                it =>
                {
                    var chunkJson = QrGeneratorUtil.CleanUpBeforeGenerating(
                        JsonSerializer.Serialize(it, JsonOptions)
                    );

                    return QrGeneratorUtil.GenerateQrCode(chunkJson);
                }
            )
            .ToList();

        return qrCodes;
    }

    public async Task<StiVatReturnDeclaration?> GetBySaleIdAsync(int saleId)
    {
        return await _database.StiVatReturnDeclarations
            .Include(it => it.QrCodes)
            .Include(it => it.Sale)
            .ThenInclude(it => it.Customer)
            .ThenInclude(it => it.OtherDocuments)
            .Include(it => it.Sale)
            .ThenInclude(it => it.Salesman)
            .Include(it => it.Sale)
            .ThenInclude(it => it.SoldGoods)
            .FirstOrDefaultAsync(d => d.SaleId == saleId);
    }

    public async Task<StiVatReturnDeclaration> SubmitAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        (await _validator.ValidateSubmitRequestAsync(request))
            .AssertValid();

        // If new customer/sale/salesman/soldGoods were created, their IDs will be seen only
        // after the transaction is committed, after ConsumeSubmitDeclarationResponse is called.
        var (declaration, isCreatedNow) = await ResolveDeclarationAsync(request);

        var clientRequest = declaration.ToSubmitDeclarationRequest(
            declaration.Sale.Customer.ResidenceCountry.ConvertToEnum<NonEuCountryCode>(),
            $"{Guid.NewGuid():N}", // Request ID, unique for each request
            _stiVatReturn
        );

        var clientResponse = await _stiVatReturnClientService.SubmitDeclarationAsync(clientRequest);

        // Inside calls _database#SaveChangesAsync
        await ConsumeSubmitDeclarationResponse(
            declaration,
            clientResponse,
            isCreatedNow
        );

        return declaration;
    }
}