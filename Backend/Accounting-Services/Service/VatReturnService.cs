using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;
using Accounting.Contract.Entity;
using Accounting.Contract.Request.StiVatReturn;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class VatReturnService : IVatReturnService
{
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

    private static void AddMissingGoods(
        IEnumerable<StiVatReturnDeclarationSubmitRequestSoldGood> missingGoods,
        Sale sale
    )
    {
        foreach (var missingGood in missingGoods)
        {
            sale.SoldGoods.Add(
                new SoldGood
                {
                    Description = missingGood.Description,
                    Quantity = missingGood.Quantity,
                    SequenceNo = missingGood.SequenceNo,
                    TaxableAmount = missingGood.TaxableAmount,
                    TotalAmount = missingGood.TotalAmount,
                    UnitOfMeasure = missingGood.UnitOfMeasure,
                    UnitOfMeasureType = missingGood.UnitOfMeasureType,
                    VatAmount = missingGood.VatAmount,
                    VatRate = missingGood.VatRate
                }
            );
        }
    }

    public async Task<StiVatReturnDeclaration> SubmitAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        (await _validator.ValidateSubmitRequestAsync(request)).AssertValid();

        var declaration = await ResolveDeclarationAsync(request);

        var clientRequest = ResolveStiClientRequest(
            request,
            declaration
        );

        var clientResponse = await _stiVatReturnClientService.SubmitDeclarationAsync(clientRequest);

        if (clientResponse.DeclarationState == null)
        {
            throw new ValidationException(
                clientResponse.Errors
                    .Select(e => e.Details)
                    .ToList()
            );
        }

        declaration.State = clientResponse.DeclarationState;
        declaration.SubmitDate = clientResponse.ResultDate;

        if (String.IsNullOrWhiteSpace(declaration.Id))
        {
            declaration.Id = clientRequest.Declaration.Header.DocumentId;
            declaration = (await _database.StiVatReturnDeclarations.AddAsync(declaration)).Entity;
        }

        await _database.SaveChangesAsync();

        // Upon submission create data that was missing and return ids together with the declaration response.
        return declaration;
    }

    private async Task<StiVatReturnDeclaration> ResolveDeclarationAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        var declaration = request.Sale.Id is not null
            ? await _database.StiVatReturnDeclarations.FirstAsync(d => d.SaleId == request.Sale.Id)
            : new StiVatReturnDeclaration();

        if (String.IsNullOrWhiteSpace(declaration.Id))
        {
            declaration.Id = $"{Guid.NewGuid():N}";
            declaration.DeclaredById = request.RequesterId;
            declaration.InstanceId = request.InstanceId;
        }

        declaration.Correction += 1;
        declaration.Sale = await ResolveSaleAsync(request.Sale, request.InstanceId);

        return declaration;
    }

    private async Task<Sale> ResolveSaleAsync(
        StiVatReturnDeclarationSubmitRequestSale sale,
        int? instanceId
    )
    {
        if (sale.Id is not null)
        {
            var saleEntity = await _database.Sales
                .Include(it => it.Customer)
                .Include(it => it.Salesman)
                .Include(it => it.SoldGoods)
                .FirstAsync(s => s.Id == sale.Id);

            var missingGoods = sale.SoldGoods
                .Where(it => it.Id is null)
                .ToList();

            // Ids will be missing for now until the outer transaction is committed.
            AddMissingGoods(missingGoods, saleEntity);

            return saleEntity;
        }

        var saleNew = new Sale
        {
            CashRegisterNo = sale.CashRegister?.CashRegisterNo,
            CashRegisterReceiptNo = sale.CashRegister?.ReceiptNo,
            Customer = (await ResolveCustomerAsync(sale.Customer))
                .Also(it => it.InstanceId = instanceId),
            Date = sale.Date,
            InstanceId = instanceId,
            InvoiceNo = sale.InvoiceNo,
            Salesman = (await ResolveSalesmanAsync(sale.Salesman))
                .Also(it => it.InstanceId = instanceId)
        };

        return saleNew;
    }

    private async Task<Customer> ResolveCustomerAsync(
        StiVatReturnDeclarationSubmitRequestCustomer customer
    )
    {
        if (customer.Id is not null)
        {
            return await _database.Customers.FirstAsync(c => c.Id == customer.Id);
        }

        return new Customer
        {
            Birthdate = customer.Birthdate,
            FirstName = customer.FirstName,
            IdentityDocument = customer.IdentityDocument.Value,
            IdentityDocumentIssuedBy = customer.IdentityDocument.IssuedBy,
            IdentityDocumentType = customer.IdentityDocument.Type,
            LastName = customer.LastName
        };
    }

    private async Task<Salesman> ResolveSalesmanAsync(
        StiVatReturnDeclarationSubmitRequestSalesman salesman
    )
    {
        if (salesman.Id is not null)
        {
            return await _database.Salesmen.FirstAsync(s => s.Id == salesman.Id);
        }

        return new Salesman
        {
            Name = salesman.Name,
            VatPayerCode = salesman.VatPayerCode.Value,
            VatPayerCodeIssuedBy = salesman.VatPayerCode.IssuedBy
        };
    }

    private SubmitDeclarationRequest ResolveStiClientRequest(
        StiVatReturnDeclarationSubmitRequest request,
        StiVatReturnDeclaration declaration
    )
    {
        var requestId = $"{Guid.NewGuid():N}";
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);

        var document = new SubmitDeclarationSalesDocument
        {
            CashRegisterReceipt = declaration.Sale.InvoiceNo is null
                ? new SubmitDeclarationCashRegisterReceipt
                {
                    CashRegisterNo = declaration.Sale.CashRegisterNo,
                    ReceiptNo = declaration.Sale.CashRegisterReceiptNo,
                }
                : null,
            Goods = declaration.Sale.SoldGoods
                .Select(
                    it => new SubmitDeclarationGoods
                    {
                        Description = it.Description,
                        Quantity = it.Quantity,
                        SequenceNo = it.SequenceNo,
                        TaxableAmount = it.TaxableAmount,
                        TotalAmount = it.TotalAmount,
                        UnitOfMeasure = it.UnitOfMeasure,
                        UnitOfMeasureType = it.UnitOfMeasureType,
                        VatAmount = it.VatAmount,
                        VatRate = it.VatRate
                    }
                )
                .ToList(),
            InvoiceNo = declaration.Sale.InvoiceNo,
            SalesDate = declaration.Sale.Date
        };

        return new SubmitDeclarationRequest
        {
            Declaration = new SubmitDeclaration
            {
                Customer = new SubmitDeclarationCustomer
                {
                    BirthDate = request.Sale.Customer.Birthdate,
                    FirstName = request.Sale.Customer.FirstName,
                    IdentityDocument = new SubmitDeclarationIdentityDocument
                    {
                        DocumentNo = new SubmitDeclarationIdDocumentNo
                        {
                            IssuedBy = request.Sale.Customer.IdentityDocument.IssuedBy,
                            Value = request.Sale.Customer.IdentityDocument.Value
                        },
                        DocumentType = request.Sale.Customer.IdentityDocument.Type
                    },
                    LastName = request.Sale.Customer.LastName
                },
                Header = new SubmitDeclarationDocumentHeader
                {
                    Affirmation = SubmitDeclarationDocumentHeaderAffirmation.Y,
                    CompletionDate = now,
                    DocumentCorrectionNo = declaration.Correction,
                    DocumentId = declaration.Id
                },
                Intermediary = new SubmitDeclarationIntermediary
                {
                    Id = _stiVatReturn.Intermediary.Id,
                    Name = _stiVatReturn.Intermediary.Name
                },
                Salesman = new SubmitDeclarationSalesman
                {
                    Name = request.Sale.Salesman.Name,
                    VatPayerCode = new SubmitDeclarationLtVatPayerCode
                    {
                        IssuedBy = request.Sale.Salesman.VatPayerCode.IssuedBy,
                        Value = request.Sale.Salesman.VatPayerCode.Value
                    }
                },
                SalesDocuments = [document]
            },
            RequestId = requestId,
            SenderId = _stiVatReturn.Intermediary.Id,
            Situation = 1,
            TimeStamp = now
        };
    }
}