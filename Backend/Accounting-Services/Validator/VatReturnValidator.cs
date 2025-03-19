using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Customer = Accounting.Contract.Dto.Customer.Customer;
using Sale = Accounting.Contract.Dto.Sale.Sale;
using Salesman = Accounting.Contract.Dto.Salesman.Salesman;

namespace Accounting.Services.Validator;

public class VatReturnValidator : IVatReturnValidator
{
    private readonly ICustomerValidator _customerValidator;
    private readonly AccountingDatabase _database;
    private readonly IInstanceValidator _instanceValidator;
    private readonly ISalesmanValidator _salesmanValidator;
    private readonly ISaleValidator _saleValidator;

    public VatReturnValidator(
        ICustomerValidator customerValidator,
        AccountingDatabase database,
        IInstanceValidator instanceValidator,
        ISalesmanValidator salesmanValidator,
        ISaleValidator saleValidator
    )
    {
        _customerValidator = customerValidator;
        _database = database;
        _instanceValidator = instanceValidator;
        _salesmanValidator = salesmanValidator;
        _saleValidator = saleValidator;
    }

    public async Task<Validation> ValidateSubmitRequestAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        if (request.InstanceId is not null)
        {
            var validation = await _instanceValidator.ValidateExistsAsync(request.InstanceId.Value);

            if (!validation.IsValid)
            {
                return validation;
            }
        }

        if (request.Sale is null && request.DeclarationId is null)
        {
            return new Validation("Either sale or declaration ID must be provided.");
        }

        var sale = request.Sale;

        if (request.DeclarationId is not null)
        {
            var saleEntity = await _database.StiVatReturnDeclarations
                .Include(it => it.Sale)
                .ThenInclude(it => it.Customer)
                .ThenInclude(it => it.OtherDocuments)
                .Include(it => it.Sale)
                .ThenInclude(it => it.Salesman)
                .Include(it => it.Sale)
                .ThenInclude(it => it.SoldGoods)
                .Where(it => it.Id == request.DeclarationId)
                .Select(it => it.Sale)
                .FirstOrDefaultAsync();

            if (saleEntity is null)
            {
                return new Validation("Declaration was not found.");
            }

            sale = saleEntity.ToDto();
        }

        if (!request.Affirmation)
        {
            return new Validation("It must be affirmed that the customer can use VAT return service.");
        }

        var failures = new List<string>();

        (await ValidateCustomerAsync(sale!.Customer))
            .Also(it => failures.AddRange(it.FailureMessages));

        (await ValidateSalesmanAsync(sale.Salesman))
            .Also(it => failures.AddRange(it.FailureMessages));

        (await ValidateSaleAsync(sale))
            .Also(it => failures.AddRange(it.FailureMessages));

        return new Validation(failures);
    }

    private async Task<Validation> ValidateCustomerAsync(Customer customer)
    {
        if (customer.Id == null)
        {
            return _customerValidator.ValidateVatReturnCustomer(customer);
        }

        var customerEntity = await _database.Customers
            .Include(it => it.OtherDocuments)
            .FirstOrDefaultAsync(it => it.Id == customer.Id && !it.IsDeleted);

        return customerEntity is null
            ? new Validation("Customer was not found.")
            : _customerValidator.ValidateVatReturnCustomer(customerEntity.ToDto());
    }

    private async Task<Validation> ValidateSaleAsync(Sale sale)
    {
        if (sale.Id == null)
        {
            return _saleValidator.ValidateVatReturnSale(sale);
        }

        var saleEntity = (await _database.Sales
                .Include(it => it.SoldGoods)
                .FirstOrDefaultAsync(it => it.Id == sale.Id && !it.IsDeleted))
            ?.Also(
                it => it.SoldGoods = it.SoldGoods
                    .Where(sg => !sg.IsDeleted)
                    .ToList()
            );

        return saleEntity is null
            ? new Validation("Sale was not found.")
            : _saleValidator.ValidateVatReturnSale(saleEntity.ToDto());
    }

    private async Task<Validation> ValidateSalesmanAsync(Salesman salesman)
    {
        if (salesman.Id == null)
        {
            return _salesmanValidator.ValidateVatReturnSalesman(salesman);
        }

        var salesmanEntity = await _database.Salesmen.FirstOrDefaultAsync(
            it => it.Id == salesman.Id && !it.IsDeleted
        );

        return salesmanEntity is null
            ? new Validation("Salesman was not found.")
            : _salesmanValidator.ValidateVatReturnSalesman(salesmanEntity.ToDto());
    }
}