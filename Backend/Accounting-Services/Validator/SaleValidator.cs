using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Entity;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Sale = Accounting.Contract.Dto.Sale.Sale;

namespace Accounting.Services.Validator;

public class SaleValidator : ISaleValidator
{
    private readonly AccountingDatabase _database;
    private readonly IInstanceValidator _instanceValidator;

    public SaleValidator(AccountingDatabase database, IInstanceValidator instanceValidator)
    {
        _database = database;
        _instanceValidator = instanceValidator;
    }

    public Validation ValidateSale(SaleCreateEdit sale, bool includeSoldGoods = true)
    {
        var failures = new List<string>();

        if (
            String.IsNullOrWhiteSpace(sale.InvoiceNo) &&
            sale.CashRegister is not null &&
            String.IsNullOrWhiteSpace(sale.CashRegister.CashRegisterNo) &&
            String.IsNullOrWhiteSpace(sale.CashRegister.ReceiptNo)
        )
        {
            failures.Add("Either InvoiceNo or CashRegisterNo and ReceiptNo both must be provided.");
        }

        if (
            String.IsNullOrWhiteSpace(sale.InvoiceNo) &&
            sale.CashRegister is not null &&
            (String.IsNullOrWhiteSpace(sale.CashRegister.CashRegisterNo) ||
             String.IsNullOrWhiteSpace(sale.CashRegister.ReceiptNo))
        )
        {
            failures.Add("Both CashRegisterNo and ReceiptNo must be provided if InvoiceNo is not provided.");
        }

        if (includeSoldGoods)
        {
            ValidateSoldGoods(sale.SoldGoods.ToList())
                .Also(it => failures.AddRange(it.FailureMessages));
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDeleteRequestAsync(int saleId)
    {
        return await ValidateExistsAsync(saleId);
    }

    public async Task<Validation> ValidateEditRequestAsync(SaleCreateEdit sale)
    {
        if (sale.Id == null)
        {
            return new Validation("Sale ID must be provided.");
        }

        var existsValidation = await ValidateExistsAsync(sale.Id!.Value);

        return !existsValidation.IsValid
            ? existsValidation
            : ValidateSale(sale);
    }

    public async Task<Validation> ValidateExistsAsync(int saleId)
    {
        return await _database.Sales.AnyAsync(it => it.Id == saleId && !it.IsDeleted)
            ? new Validation()
            : new Validation("Sale was not found.");
    }

    public async Task<Validation> ValidateGetByIdRequestAsync(int saleId)
    {
        return await ValidateExistsAsync(saleId);
    }

    public async Task<Validation> ValidateGetRequestAsync(int instanceId)
    {
        return await _instanceValidator.ValidateExistsAsync(instanceId);
    }

    public Validation ValidateSoldGood(SoldGoodCreateEdit soldGood, int? sequenceNo = null)
    {
        var failures = new List<string>();

        if (soldGood.UnitPrice <= 0)
        {
            failures.Add("Unit price must be greater than 0.");
        }

        if (soldGood.Quantity <= 0)
        {
            failures.Add("Quantity must be greater than 0.");
        }

        if (soldGood.VatRate is <= 0.01m or > 100)
        {
            failures.Add("VAT rate (%) must be between 0.01 and 100.");
        }

        if (
            soldGood.UnitOfMeasureType == UnitOfMeasureType.UnitOfMeasureCode &&
            (String.IsNullOrWhiteSpace(soldGood.UnitOfMeasure) ||
             soldGood.UnitOfMeasure.Length != 3)
        )
        {
            failures.Add("Measurement unit must be 3 characters when using measurement codes standard.");
        }

        return new Validation(
            sequenceNo is null
                ? failures
                : failures
                    .Select(it => $"Sold good #{sequenceNo}: {it}")
                    .ToList()
        );
    }

    public Validation ValidateSoldGoods(ICollection<SoldGoodCreateEdit> soldGoods)
    {
        if (soldGoods.Count == 0)
        {
            return new Validation("At least one sold good must be provided.");
        }

        var failures = new List<string>();

        for (var i = 0; i < soldGoods.Count; i++)
        {
            var soldGood = soldGoods.ElementAt(i);

            ValidateSoldGood(soldGood, i + 1)
                .Also(it => failures.AddRange(it.FailureMessages));
        }

        return new Validation(failures);
    }

    public Validation ValidateVatReturnSale(Sale sale)
    {
        var failures = new List<string>();
        var saleCreateEdit = sale.ToDtoCreateEdit();

        // Converting to CreateEdit DTO, because it has sufficient properties for validation
        // And so we can reuse the existing validation methods
        ValidateSale(saleCreateEdit, false)
            .Also(it => failures.AddRange(it.FailureMessages));

        if (
            !String.IsNullOrWhiteSpace(sale.CashRegister?.CashRegisterNo) &&
            sale.CashRegister?.CashRegisterNo?.Length is < 1 or > 50
        )
        {
            failures.Add("Sale's cash register number must be between 1 and 50 characters.");
        }

        if (
            !String.IsNullOrWhiteSpace(sale.CashRegister?.ReceiptNo) &&
            sale.CashRegister.ReceiptNo.Length is < 1 or > 70
        )
        {
            failures.Add("Sale's receipt number must be between 1 and 70 characters.");
        }

        if (
            !String.IsNullOrWhiteSpace(sale.InvoiceNo) &&
            sale.InvoiceNo.Length is < 1 or > 70
        )
        {
            failures.Add("Sale's invoice number must be between 1 and 70 characters.");
        }

        // Converting to CreateEdit DTO, because it has sufficient properties for validation
        // And so we can reuse the existing validation methods
        ValidateVatReturnSoldGoods(saleCreateEdit.SoldGoods.ToList())
            .Also(it => failures.AddRange(it.FailureMessages));

        return new Validation(failures);
    }

    public Validation ValidateVatReturnSoldGood(SoldGoodCreateEdit soldGood, int? sequenceNo = null)
    {
        var failuresInitial = ValidateSoldGood(soldGood, sequenceNo).FailureMessages
            .ToList();

        var failures = new List<string>();

        if (soldGood.Description.Length is < 1 or > 500)
        {
            failures.Add("Description must be between 1 and 500 characters.");
        }

        if (
            soldGood.UnitOfMeasureType == UnitOfMeasureType.UnitOfMeasureOther &&
            soldGood.UnitOfMeasure.Length is < 1 or > 50
        )
        {
            failures.Add("Measurement unit must be between 1 and 50 characters when using other unit.");
        }

        if (sequenceNo is not null)
        {
            failures = failures
                .Select(it => $"Sold good #{sequenceNo}: {it}")
                .ToList();
        }

        failuresInitial.AddRange(failures);

        return new Validation(failuresInitial);
    }

    public Validation ValidateVatReturnSoldGoods(ICollection<SoldGoodCreateEdit> soldGoods)
    {
        if (soldGoods.Count == 0)
        {
            return new Validation("At least one sold good must be provided.");
        }

        if (soldGoods.Sum(it => it.TotalPriceAdjusted) < 40)
        {
            return new Validation("Total price of sold goods must reach at least €40.");
        }

        var failures = new List<string>();

        for (var i = 0; i < soldGoods.Count; i++)
        {
            var soldGood = soldGoods.ElementAt(i);

            ValidateVatReturnSoldGood(soldGood, i + 1)
                .Also(it => failures.AddRange(it.FailureMessages));
        }

        return new Validation(failures);
    }
}