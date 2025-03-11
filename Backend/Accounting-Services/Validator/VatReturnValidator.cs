using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class VatReturnValidator : IVatReturnValidator
{
    private readonly AccountingDatabase _database;

    public VatReturnValidator(AccountingDatabase database)
    {
        _database = database;
    }

    // TODO: Add all validations for VAT return declaration submit request.
    public async Task<Validation> ValidateSubmitRequestAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        if (!request.Affirmation)
        {
            return new Validation("You must affirm that the customer can be returned VAT.");
        }

        if (!request.Sale.SoldGoods.Any())
        {
            return new Validation("At least one sold good must be provided.");
        }

        var instance = request.InstanceId is not null
            ? await _database.Instances
                .Include(i => i.UserMetas)
                .FirstOrDefaultAsync(i => i.Id == request.InstanceId)
            : null;

        // Check if instance to use was provided, but not found.
        if (instance is null && request.InstanceId is not null)
        {
            return new Validation("Instance not found.");
        }

        var validation = await ValidateSubmitRequestSaleAsync(request.Sale);

        return !validation.IsValid ? validation : new Validation();
    }

    public async Task<Validation> ValidateSubmitRequestCustomerAsync(
        Customer customer
    )
    {
        var customerEntity = customer.Id is not null
            ? await _database.Customers.FirstOrDefaultAsync(it => it.Id == customer.Id)
            : null;

        if (customerEntity is null && customer.Id is not null)
        {
            return new Validation("Customer not found.");
        }
        
        // If customer has single name, FirstName contains "-" symbol and customer's actual name is
        // stored in the LastName field.

        return new Validation();
    }

    public async Task<Validation> ValidateSubmitRequestSaleAsync(
        Sale sale
    )
    {
        var saleEntity = sale.Id is not null
            ? await _database.Sales.FirstOrDefaultAsync(it => it.Id == sale.Id)
            : null;

        if (saleEntity is null && sale.Id is not null)
        {
            return new Validation("Sale not found.");
        }

        var declaration = await _database.StiVatReturnDeclarations.FirstOrDefaultAsync(
            it => it.SaleId == sale.Id
        );

        if (declaration != null && declaration.State == SubmitDeclarationState.ACCEPTED_CORRECT)
        {
            return new Validation(
                "Sale declaration for VAT return is already submitted and accepted."
            );
        }

        var failures = new List<string>();

        failures.AddRange(
            (await ValidateSubmitRequestSalesmanAsync(sale.Salesman)).FailureMessages
        );

        failures.AddRange(
            (await ValidateSubmitRequestCustomerAsync(sale.Customer)).FailureMessages
        );

        foreach (var soldGood in sale.SoldGoods)
        {
            failures.AddRange(
                (await ValidateSubmitRequestSoldGoodAsync(soldGood)).FailureMessages
            );
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateSubmitRequestSalesmanAsync(
        Salesman salesman
    )
    {
        var salesmanEntity = salesman.Id is not null
            ? await _database.Salesmen.FirstOrDefaultAsync(it => it.Id == salesman.Id)
            : null;

        if (salesmanEntity is null && salesman.Id is not null)
        {
            return new Validation("Salesman not found.");
        }

        return new Validation();
    }

    public async Task<Validation> ValidateSubmitRequestSoldGoodAsync(
        SoldGood soldGood
    )
    {
        var soldGoodEntity = soldGood.Id is not null
            ? await _database.SoldGoods.FirstOrDefaultAsync(it => it.Id == soldGood.Id)
            : null;

        if (soldGoodEntity is null && soldGood.Id is not null)
        {
            return new Validation("Sold good not found.");
        }

        return new Validation();
    }

    public async Task<Validation> ValidateSubmitRequestAuthorizationAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        var sale = request.Sale.Id is not null
            ? await _database.Sales.FirstOrDefaultAsync(it => it.Id == request.Sale.Id)
            : null;

        if (sale is not null && sale.InstanceId != request.InstanceId)
        {
            return new Validation("Specified sale is not accessible.");
        }

        var customer = request.Sale.Customer.Id is not null
            ? await _database.Customers.FirstOrDefaultAsync(it => it.Id == request.Sale.Customer.Id)
            : null;

        if (customer is not null && customer.InstanceId != request.InstanceId)
        {
            return new Validation("Specified customer is not accessible.");
        }

        var salesman = request.Sale.Salesman.Id is not null
            ? await _database.Salesmen.FirstOrDefaultAsync(it => it.Id == request.Sale.Salesman.Id)
            : null;

        if (salesman is not null && salesman.InstanceId != request.InstanceId)
        {
            return new Validation("Specified salesman is not accessible.");
        }

        if (request.Sale.Id is null)
        {
            return new Validation();
        }

        var soldGoodIds = request.Sale.SoldGoods
            .Select(it => it.Id)
            .Where(it => it is not null)
            .ToHashSet();

        var soldGoods = await _database.SoldGoods
            .Where(it => soldGoodIds.Contains(it.Id))
            .ToListAsync();

        return new Validation(
            soldGoods
                .Where(it => it.SaleId != request.Sale.Id)
                .Select(it => $"Sold good '{it.Id}' is not associated with the provided sale.")
                .ToList()
        );
    }
}