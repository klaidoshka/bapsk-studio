using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Dto.Sti;
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

        var (declaration, isNew) = await ResolveDeclarationAsync(request);
        var clientRequest = ResolveStiClientRequest(declaration);
        var clientResponse = await _stiVatReturnClientService.SubmitDeclarationAsync(clientRequest);

        if (clientResponse.DeclarationState == null)
        {
            throw new ValidationException(
                clientResponse.Errors
                    .Select(e => e.Description)
                    .ToList()
            );
        }

        declaration.State = clientResponse.DeclarationState;
        declaration.SubmitDate = clientResponse.ResultDate.ToUniversalTime();

        if (isNew)
        {
            declaration = (await _database.StiVatReturnDeclarations.AddAsync(declaration)).Entity;
        }
        else
        {
            _database.Update(declaration);
        }

        await _database.SaveChangesAsync();

        if (clientResponse.DeclarationState == SubmitDeclarationState.REJECTED)
        {
            throw new ValidationException(
                clientResponse.Errors
                    .Select(e => e.Description)
                    .ToList(),
                InternalFailure.VatReturnDeclarationSubmitRejectedButUpdated
            );
        }

        return declaration;
    }

    /// <returns>Declaration and check of its new creation (true, or false otherwise)</returns>
    private async Task<(StiVatReturnDeclaration, bool)> ResolveDeclarationAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        var isNew = true;
        StiVatReturnDeclaration? declaration;

        if (request.Sale.Id is not null)
        {
            declaration = await _database.StiVatReturnDeclarations.FirstOrDefaultAsync(d => d.SaleId == request.Sale.Id);

            if (declaration is null)
            {
                declaration = new();
            }
            else
            {
                isNew = false;
            }
        }
        else
        {
            declaration = new();
        }

        if (isNew)
        {
            declaration.Id = $"{Guid.NewGuid():N}";
            declaration.DeclaredById = request.RequesterId;
            declaration.InstanceId = request.InstanceId;
        }

        // TODO: In the future it may be useful to track who modified the declaration and when
        //      initially declaration was submitted.
        declaration.Correction += 1;
        declaration.Sale = await ResolveSaleAsync(request.Sale, request.InstanceId);

        return (declaration, isNew);
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

    private SubmitDeclarationRequest ResolveStiClientRequest(StiVatReturnDeclaration declaration)
    {
        var requestId = $"{Guid.NewGuid():N}";
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);
        
        var customerIdentityDocument = new SubmitDeclarationIdentityDocument
        {
            DocumentNo = new()
            {
                IssuedBy = declaration.Sale.Customer.IdentityDocumentIssuedBy,
                Value = declaration.Sale.Customer.IdentityDocumentNumber
            },
            DocumentType = declaration.Sale.Customer.IdentityDocumentType
        };

        var customerPersonalCode = declaration.Sale.Customer.IdentityDocumentValue is not null
            ? new SubmitDeclarationPersonId
            {
                IssuedBy = declaration.Sale.Customer.IdentityDocumentIssuedBy,
                Value = declaration.Sale.Customer.IdentityDocumentValue
            }
            : null;

        var customerOtherDocuments = declaration.Sale.Customer.OtherDocuments
            .Select(
                it => new SubmitDeclarationOtherDocument
                {
                    DocumentNo = new SubmitDeclarationOtherDocumentNo
                    {
                        IssuedBy = it.IssuedBy,
                        Value = it.Value
                    },
                    DocumentType = it.Type
                }
            )
            .ToList();

        var customer = new SubmitDeclarationCustomer
        {
            BirthDate = TimeZoneInfo.ConvertTimeFromUtc(declaration.Sale.Customer.Birthdate.Date, timeZone),
            FirstName = declaration.Sale.Customer.FirstName,
            IdentityDocument = customerIdentityDocument,
            LastName = declaration.Sale.Customer.LastName,
            OtherDocuments = customerOtherDocuments,
            PersonId = customerPersonalCode,
            ResidentCountryCode = declaration.Sale.Customer.ResidenceCountry.ConvertToEnumOrNull<NonEuCountryCode>()
        };

        var salesman = new SubmitDeclarationSalesman
        {
            Name = declaration.Sale.Salesman.Name,
            VatPayerCode = new SubmitDeclarationLtVatPayerCode
            {
                IssuedBy = declaration.Sale.Salesman.VatPayerCodeIssuedBy,
                Value = declaration.Sale.Salesman.VatPayerCode
            }
        };

        var sale = new SubmitDeclarationSalesDocument
        {
            CashRegisterReceipt = String.IsNullOrWhiteSpace(declaration.Sale.InvoiceNo)
                ? new SubmitDeclarationCashRegisterReceipt
                {
                    CashRegisterNo = declaration.Sale.CashRegisterNo!,
                    ReceiptNo = declaration.Sale.CashRegisterReceiptNo!,
                }
                : null,
            Goods = declaration.Sale.SoldGoods
                .Select(
                    it => new SubmitDeclarationGoods
                    {
                        Description = it.Description,
                        Quantity = it.Quantity,
                        SequenceNo = it.SequenceNo,
                        TaxableAmount = Math.Round(it.TaxableAmount, 2),
                        TotalAmount = Math.Round(it.TotalAmount, 2),
                        UnitOfMeasure = it.UnitOfMeasure,
                        UnitOfMeasureType = it.UnitOfMeasureType,
                        VatAmount = Math.Round(it.VatAmount, 2),
                        VatRate = Math.Round(it.VatRate, 2)
                    }
                )
                .ToList(),
            InvoiceNo = String.IsNullOrWhiteSpace(declaration.Sale.InvoiceNo)
                ? null
                : declaration.Sale.InvoiceNo,
            SalesDate = TimeZoneInfo.ConvertTimeFromUtc(declaration.Sale.Date.Date, timeZone)
        };

        return new()
        {
            Declaration = new SubmitDeclaration
            {
                Customer = customer,
                Header = new SubmitDeclarationDocumentHeader
                {
                    Affirmation = SubmitDeclarationDocumentHeaderAffirmation.Y,
                    CompletionDate = now.Date,
                    DocumentCorrectionNo = declaration.Correction,
                    DocumentId = declaration.Id
                },
                Intermediary = new SubmitDeclarationIntermediary
                {
                    Id = _stiVatReturn.Intermediary.Id,
                    Name = _stiVatReturn.Intermediary.Name
                },
                Salesman = salesman,
                SalesDocuments = [sale]
            },
            RequestId = requestId,
            SenderId = _stiVatReturn.Intermediary.Id,
            Situation = 1,
            TimeStamp = now
                .ToString("yyyy-MM-ddTHH:mm:ss")
                .Let(DateTime.Parse),
        };
    }
}