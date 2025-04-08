using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Butenta;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Dto.Sti.VatReturn.Qr;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Email;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Sale = Accounting.Contract.Entity.Sale;
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
    private readonly ICustomerService _customerService;
    private readonly AccountingDatabase _database;
    private readonly IEmailService _emailService;
    private readonly ISaleService _saleService;
    private readonly ISalesmanService _salesmanService;
    private readonly StiVatReturn _stiVatReturn;
    private readonly IStiVatReturnClientService _stiVatReturnClientService;
    private readonly IVatReturnValidator _validator;

    public VatReturnService(
        IButentaService butentaService,
        ICountryService countryService,
        ICustomerService customerService,
        AccountingDatabase database,
        IEmailService emailService,
        ISaleService saleService,
        ISalesmanService salesmanService,
        StiVatReturn stiVatReturn,
        IStiVatReturnClientService stiVatReturnClientService,
        IVatReturnValidator validator
    )
    {
        _butentaService = butentaService;
        _countryService = countryService;
        _customerService = customerService;
        _database = database;
        _emailService = emailService;
        _saleService = saleService;
        _salesmanService = salesmanService;
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

        if (response.DeclarationState.Value != SubmitDeclarationState.REJECTED)
        {
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

        var sale = await MapButentaTradeToSaleAsync(tradeId);

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
                Emails.VatReturnDeclarationStatusChange(
                    declaration,
                    GeneratePreviewCode(declaration)
                )
            );
        }
    }

    public async Task CancelAsync(int saleId)
    {
        var declaration = await GetBySaleIdAsync(saleId);
        
        if (declaration is null)
        {
            throw new ValidationException("Couldn't find declaration to cancel.");
        }

        if (declaration.IsCanceled)
        {
            throw new ValidationException("Declaration is already canceled.");
        }
        
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");

        var clientRequest = new CancelDeclarationRequest
        {
            DocumentId = declaration.Id,
            RequestId = $"{Guid.NewGuid():N}",
            SenderId = _stiVatReturn.Sender.Id,
            TimeStamp = DateTime.Parse(
                TimeZoneInfo
                    .ConvertTimeFromUtc(DateTime.UtcNow, timeZone)
                    .ToString("yyyy-MM-ddTHH:mm:ss")
            )
        };

        var clientResponse = await _stiVatReturnClientService.CancelDeclarationAsync(clientRequest);

        if (clientResponse.ResultStatus != ResultStatus.SUCCESS)
        {
            throw new ValidationException(
                clientResponse.Errors!
                    .Select(e => e.Description)
                    .ToList()
            );
        }

        declaration.IsCanceled = true;

        await _database.SaveChangesAsync();
    }

    public async Task<string> GenerateDeclarationIdAsync()
    {
        var nextId = await _database.StiVatReturnDeclarations.CountAsync() + 1;

        return $"{_stiVatReturn.Sender.Id}/VAT.R/{nextId}";
    }

    public string GeneratePreviewCode(StiVatReturnDeclaration declaration)
    {
        var code = $"${declaration.SaleId}${declaration.Sale.CustomerId}${declaration.Id}${declaration.Sale.SalesmanId}";

        return Convert.ToBase64String(Encoding.ASCII.GetBytes(code));
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

    public async Task<StiVatReturnDeclaration?> GetByPreviewCodeAsync(string code)
    {
        var values = ReadPreviewCodeValues(code);
        var declaration = await GetBySaleIdAsync(values.SaleId);

        if (
            declaration is null ||
            declaration.Sale.CustomerId != values.CustomerId ||
            declaration.SaleId != values.SaleId ||
            declaration.Sale.SalesmanId != values.SalesmanId
        )
        {
            throw new ValidationException("Invalid declaration preview code.");
        }

        return declaration;
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
            .Include(it => it.Export)
            .ThenInclude(it => it!.VerifiedSoldGoods)
            .Include(it => it.Export)
            .ThenInclude(it => it!.Conditions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(d => d.SaleId == saleId);
    }

    public async Task<Sale> MapButentaTradeToSaleAsync(int tradeId)
    {
        var trade = await _butentaService.GetTradeWithClientsAsync(tradeId);

        if (trade == null)
        {
            throw new ValidationException(
                "Trade unresolved. It, receiver (customer), or supplier (salesman) might not exist."
            );
        }

        var customerCountry = _countryService.GetCountryCode(trade.Receiver.Country);
        var salesmanCountry = _countryService.GetCountryCode(trade.Supplier.Country);

        return trade.ToEntity(customerCountry, salesmanCountry);
    }

    public PreviewCodeValues ReadPreviewCodeValues(string code)
    {
        var decoded = Encoding.ASCII.GetString(Convert.FromBase64String(code));
        var parts = decoded.Split('$');

        if (parts.Length != 5)
        {
            throw new ValidationException("Invalid declaration preview code.");
        }

        var failed = false;

        failed |= !Int32.TryParse(parts[1], out var saleId);
        failed |= !Int32.TryParse(parts[2], out var customerId);
        failed |= !Int32.TryParse(parts[4], out var salesmanId);

        if (failed)
        {
            throw new ValidationException("Invalid declaration preview code.");
        }

        return new PreviewCodeValues
        {
            CustomerId = customerId,
            DeclarationId = parts[3],
            SaleId = saleId,
            SalesmanId = salesmanId
        };
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
            $"{Guid.NewGuid():N}",
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
            $"{Guid.NewGuid():N}",
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

    public async Task UpdateButentaTradeAsync(int tradeId)
    {
        var saleCurrent = (await _butentaService.GetVatReturnDeclarationByTradeId(tradeId))?.Sale;

        if (saleCurrent is null)
        {
            throw new ValidationException("Trade is not submitted yet.");
        }

        var saleUpdated = await MapButentaTradeToSaleAsync(tradeId);
        await using var transaction = await _database.Database.BeginTransactionAsync();

        try
        {
            await _customerService.EditAsync(
                new CustomerEditRequest
                {
                    Customer = saleCurrent.Customer.ToDto()
                }
            );

            await _salesmanService.EditAsync(
                new SalesmanEditRequest
                {
                    Salesman = saleUpdated.Salesman.ToDto()
                }
            );

            await _saleService.EditAsync(
                new SaleEditRequest
                {
                    Sale = saleUpdated
                        .ToDto()
                        .ToDtoCreateEdit()
                }
            );

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();

            throw;
        }
    }

    public async Task UpdateInfoAsync(StiVatReturnDeclarationUpdateInfoRequest request)
    {
        if (request.PreviewCode is null && request.SaleId is null)
        {
            throw new ValidationException("Invalid declaration info update request.");
        }

        var declaration = request.PreviewCode is null
            ? await GetBySaleIdAsync(request.SaleId!.Value)
            : await GetByPreviewCodeAsync(request.PreviewCode);

        if (declaration is null)
        {
            throw new ValidationException("Couldn't find declaration to update info for.");
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");

        var now = DateTime.Parse(
            TimeZoneInfo
                .ConvertTimeFromUtc(DateTime.UtcNow, timeZone)
                .ToString("yyyy-MM-ddTHH:mm:ss")
        );

        var clientRequest = new ExportedGoodsRequest
        {
            DocumentId = declaration.Id,
            RequestId = $"{Guid.NewGuid():N}",
            SenderId = _stiVatReturn.Sender.Id,
            TimeStamp = now
        };

        var clientResponse = await _stiVatReturnClientService.GetInfoOnExportedGoodsAsync(clientRequest);

        if (clientResponse.ResultStatus != ResultStatus.SUCCESS)
        {
            return;
        }

        if (declaration.Export is not null)
        {
            _database.StiVatReturnDeclarationExports.Remove(declaration.Export);

            declaration.Export = null;
        }

        var export = clientResponse.ToEntity();

        export.Declaration = declaration;

        await _database.StiVatReturnDeclarationExports.AddAsync(export);
        await _database.SaveChangesAsync();
    }
}