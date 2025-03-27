using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Butenta;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.Qr;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Email;
using Accounting.Contract.Entity;
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

    private readonly IButentaService _butentaService;
    private readonly ICountryService _countryService;
    private readonly AccountingDatabase _database;
    private readonly IEmailService _emailService;
    private readonly StiVatReturn _stiVatReturn;
    private readonly IStiVatReturnClientService _stiVatReturnClientService;
    private readonly IVatReturnValidator _validator;

    public VatReturnService(
        IButentaService butentaService,
        ICountryService countryService,
        AccountingDatabase database,
        IEmailService emailService,
        StiVatReturn stiVatReturn,
        IStiVatReturnClientService stiVatReturnClientService,
        IVatReturnValidator validator
    )
    {
        _butentaService = butentaService;
        _countryService = countryService;
        _database = database;
        _emailService = emailService;
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

        SubmitDeclarationState? stateOld = isCreatedNow ? null : declaration.State;
        declaration.State = response.DeclarationState.Value;
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

        if (stateOld != declaration.State)
        {
            await SendEmailIfExistsAsync(declaration);
        }

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

    private async Task<StiVatReturnDeclaration> ResolveButentaDeclarationAsync(int tradeId)
    {
        var declaration = await _butentaService.GetVatReturnDeclarationByTradeId(tradeId);

        if (declaration is not null)
        {
            declaration.Correction += 1;

            return declaration;
        }

        var trade = await _butentaService.GetTradeWithClientsAsync(tradeId);

        if (trade == null)
        {
            throw new ValidationException(
                "Trade unresolved. It, receiver (customer), or supplier (salesman) might not exist."
            );
        }

        var customerCountry = _countryService.GetCountryCode(trade.Receiver.Country);
        var salesmanCountry = _countryService.GetCountryCode(trade.Supplier.Country);
        var sale = trade.ToEntity(customerCountry, salesmanCountry);

        declaration = new StiVatReturnDeclaration
        {
            Correction = 1,
            Id = await GenerateDeclarationIdAsync(),
            Sale = sale
        };

        await _database.ButentaTrades.AddAsync(
            new ButentaTrade
            {
                Declaration = declaration,
                Id = tradeId
            }
        );

        return declaration;
    }

    // Returns declaration and mark whether it is freshly created
    private async Task<StiVatReturnDeclaration> ResolveDeclarationAsync(StiVatReturnDeclarationSubmitRequest request)
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

        return declaration;
    }

    private async Task SendEmailIfExistsAsync(StiVatReturnDeclaration declaration)
    {
        if (declaration.Sale.Customer.Email is not null)
        {
            await _emailService.SendAsync(
                declaration.Sale.Customer.Email,
                Emails.VatReturnDeclarationStatusChange(declaration)
            );
        }
    }

    public async Task<string> GenerateDeclarationIdAsync()
    {
        var nextId = await _database.StiVatReturnDeclarations.CountAsync() + 1;

        return $"{_stiVatReturn.Sender.Id}/VAT.R/{nextId}";
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
            .AsSplitQuery()
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
        var declaration = await ResolveDeclarationAsync(request);

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
            declaration.Correction == 1
        );

        return declaration;
    }

    public async Task<StiVatReturnDeclaration> SubmitButentaTradeAsync(int tradeId)
    {
        // TODO: Handle any changes to sale/customer/salesman/soldGoods
        // Maybe create new endpoint that would fetch and apply changes, otherwise keep this as it is.
        var declaration = await ResolveButentaDeclarationAsync(tradeId);

        (await _validator.ValidateSubmitRequestAsync(
            new StiVatReturnDeclarationSubmitRequest
            {
                Affirmation = true,
                Sale = declaration.Sale.ToDto()
            }
        )).AssertValid();

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
            declaration.Correction == 1
        );

        return declaration;
    }
}