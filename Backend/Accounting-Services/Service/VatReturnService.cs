using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Customer = Accounting.Contract.Dto.Customer.Customer;
using Sale = Accounting.Contract.Dto.Sale.Sale;
using Salesman = Accounting.Contract.Dto.Salesman.Salesman;
using SoldGood = Accounting.Contract.Dto.Sale.SoldGood;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

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

    public async Task<StiVatReturnDeclaration?> GetBySaleIdAsync(int saleId)
    {
        return await _database.StiVatReturnDeclarations
            .Include(it => it.Sale)
            .ThenInclude(it => it.Customer)
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
            ? (await _database.StiVatReturnDeclarations.FirstOrDefaultAsync(d => d.SaleId == request.Sale.Id)) ?? new()
            : new();

        if (String.IsNullOrWhiteSpace(declaration.Id))
        {
            declaration.Id = $"{Guid.NewGuid():N}";
            declaration.DeclaredById = request.RequesterId;
            declaration.InstanceId = request.InstanceId;
        }

        // TODO: In the future it may be useful to track who modified the declaration and when
        //      initially declaration was submitted.
        declaration.Correction += 1;
        declaration.Sale = await ResolveSaleAsync(request.Sale, request.InstanceId);

        return declaration;
    }

    private async Task<Contract.Entity.Sale> ResolveSaleAsync(
        Sale sale,
        int? instanceId
    )
    {
        if (sale.Id is null)
        {
            // Sale id will be missing until the outer transaction is committed.
            return new Contract.Entity.Sale
            {
                CashRegisterNo = sale.CashRegister?.CashRegisterNo,
                CashRegisterReceiptNo = sale.CashRegister?.ReceiptNo,
                Customer = (await ResolveCustomerAsync(sale.Customer))
                    .Also(it => it.InstanceId = instanceId),
                Date = sale.Date,
                InstanceId = instanceId,
                InvoiceNo = sale.InvoiceNo,
                Salesman = (await ResolveSalesmanAsync(sale.Salesman))
                    .Also(it => it.InstanceId = instanceId),
                SoldGoods = await ResolveSoldGoodsAsync(sale.SoldGoods)
            };
        }

        var saleEntity = await _database.Sales
            .Include(it => it.Customer)
            .Include(it => it.Salesman)
            .Include(it => it.SoldGoods)
            .FirstAsync(s => s.Id == sale.Id);

        var missingGoods = sale.SoldGoods
            .Where(it => it.Id is null)
            .ToList();

        // Ids will be missing for now until the outer transaction is committed.
        foreach (var missingGood in missingGoods)
        {
            saleEntity.SoldGoods.Add(missingGood.ToEntity());
        }

        var removedGoods = saleEntity.SoldGoods
            .Where(it => sale.SoldGoods.All(sg => sg.Id != it.Id))
            .ToList();

        foreach (var removedGood in removedGoods)
        {
            saleEntity.SoldGoods.Remove(removedGood);
        }

        return saleEntity;
    }

    private async Task<Contract.Entity.Customer> ResolveCustomerAsync(
        Customer customer
    )
    {
        if (customer.Id is not null)
        {
            return await _database.Customers.FirstAsync(c => c.Id == customer.Id);
        }

        // Customer id will be missing until the outer transaction is committed.
        return customer.ToEntity();
    }

    private async Task<Contract.Entity.Salesman> ResolveSalesmanAsync(
        Salesman salesman
    )
    {
        if (salesman.Id is not null)
        {
            return await _database.Salesmen.FirstAsync(s => s.Id == salesman.Id);
        }

        // Salesman id will be missing until the outer transaction is committed.
        return salesman.ToEntity();
    }

    /// <summary>
    /// Resolves sold goods for new sale. This is not to be used for updating existing sales.
    /// </summary>
    /// <param name="soldGoods">Provided sold goods in the declaration request</param>
    /// <returns>
    /// Resolved sold goods, stored in database. Ids will be missing until outer transaction is
    /// commited.
    /// </returns>
    private async Task<ICollection<Contract.Entity.SoldGood>> ResolveSoldGoodsAsync(
        IEnumerable<SoldGood> soldGoods
    )
    {
        var soldGoodsResolved = new List<Contract.Entity.SoldGood>();

        foreach (var soldGood in soldGoods)
        {
            if (soldGood.Id is not null)
            {
                soldGoodsResolved.Add(
                    await _database.SoldGoods.FirstAsync(sg => sg.Id == soldGood.Id)
                );

                continue;
            }

            // Sold good id will be missing until the outer transaction is committed.
            soldGoodsResolved.Add(soldGood.ToEntity());
        }

        return soldGoodsResolved;
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
            CashRegisterReceipt = String.IsNullOrWhiteSpace(declaration.Sale.InvoiceNo)
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
                        TaxableAmount = it.TaxableAmount, // Ensure it is of <18 decimals and 2 of them are decimal places
                        TotalAmount = it.TotalAmount, // Ensure it is of <18 decimals and 2 of them are decimal places
                        UnitOfMeasure = it.UnitOfMeasure,
                        UnitOfMeasureType = it.UnitOfMeasureType,
                        VatAmount = it.VatAmount, // Ensure it is of <18 decimals and 2 of them are decimal places
                        VatRate = it.VatRate // Ensure it is between 0 and 100, only 2 decimal places
                    }
                )
                .ToList(),
            InvoiceNo = String.IsNullOrWhiteSpace(declaration.Sale.InvoiceNo)
                ? null
                : declaration.Sale.InvoiceNo,
            SalesDate = declaration.Sale.Date // Set date format, timezone
        };

        return new SubmitDeclarationRequest
        {
            Declaration = new SubmitDeclaration
            {
                Customer = new SubmitDeclarationCustomer
                {
                    BirthDate = request.Sale.Customer.Birthdate, // Set date format, timezone
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
                    CompletionDate = now, // Set date format, timezone
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
            TimeStamp = now // Set date format, timezone
        };
    }
}