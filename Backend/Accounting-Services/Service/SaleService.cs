using Accounting.Contract;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Sale = Accounting.Contract.Entity.Sale;

namespace Accounting.Services.Service;

public class SaleService : ISaleService
{
    private readonly AccountingDatabase _database;
    private readonly ISaleValidator _saleValidator;

    public SaleService(AccountingDatabase database, ISaleValidator saleValidator)
    {
        _database = database;
        _saleValidator = saleValidator;
    }

    public async Task<Sale> CreateAsync(SaleCreateRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        // Validate properties
        (await _saleValidator.ValidateSaleAsync(request.Sale)).AssertValid();

        var customer = await _database.Customers.FirstAsync(it => it.Id == request.Sale.CustomerId);
        var salesman = await _database.Salesmen.FirstAsync(it => it.Id == request.Sale.SalesmanId);

        var sale = (await _database.Sales.AddAsync(
            new Sale
            {
                CashRegisterNo = request.Sale.CashRegister?.CashRegisterNo,
                CashRegisterReceiptNo = request.Sale.CashRegister?.ReceiptNo,
                Customer = customer,
                Date = request.Sale.Date,
                InstanceId = request.InstanceId,
                InvoiceNo = request.Sale.InvoiceNo,
                Salesman = salesman,
                SoldGoods = request.Sale.SoldGoods
                    .Select(it => it.ToEntity())
                    .ToList()
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return sale;
    }

    public async Task DeleteAsync(SaleDeleteRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        // Validate if sale exists
        (await _saleValidator.ValidateDeleteRequestAsync(request.SaleId)).AssertValid();

        var sale = await _database.Sales
            .Include(it => it.SoldGoods)
            .FirstAsync(it => it.Id == request.SaleId);

        sale.IsDeleted = true;

        foreach (var soldGood in sale.SoldGoods)
        {
            soldGood.IsDeleted = true;
        }

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(SaleEditRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        // Validate if sale exists
        // Validate properties
        (await _saleValidator.ValidateEditRequestAsync(request.Sale)).AssertValid();

        var sale = await _database.Sales
            .Include(it => it.SoldGoods)
            .FirstAsync(it => it.Id == request.Sale.Id);

        sale.CashRegisterNo = request.Sale.CashRegister?.CashRegisterNo;
        sale.CashRegisterReceiptNo = request.Sale.CashRegister?.ReceiptNo;
        sale.CustomerId = request.Sale.CustomerId;
        sale.Date = request.Sale.Date;
        sale.InvoiceNo = request.Sale.InvoiceNo;
        sale.SalesmanId = request.Sale.SalesmanId;

        var existingSoldGoods = sale.SoldGoods.ToDictionary(it => it.Id);

        foreach (var soldGood in request.Sale.SoldGoods)
        {
            if (soldGood.Id is null)
            {
                sale.SoldGoods.Add(soldGood.ToEntity());

                continue;
            }

            existingSoldGoods[soldGood.Id.Value]
                .Also(
                    it =>
                    {
                        it.Description = soldGood.Description;
                        it.Quantity = soldGood.Quantity;
                        it.SequenceNo = soldGood.SequenceNo;
                        it.UnitOfMeasure = soldGood.UnitOfMeasure;
                        it.UnitOfMeasureType = soldGood.UnitOfMeasureType;
                        it.VatRate = Math.Round(soldGood.VatRate, 2);
                        it.TaxableAmount = Math.Round(soldGood.Quantity * soldGood.UnitPrice, 2);
                        it.VatAmount = Math.Round(it.TaxableAmount * soldGood.VatRate / 100, 2);
                        it.TotalAmount = Math.Round(it.TaxableAmount + it.VatAmount, 2);
                    }
                );
        }

        var requestSoldGoodIds = request.Sale.SoldGoods
            .Select(it => it.Id)
            .ToHashSet();

        existingSoldGoods.Values
            .Where(soldGood => !requestSoldGoodIds.Contains(soldGood.Id))
            .ToList()
            .ForEach(soldGood => soldGood.IsDeleted = true);

        await _database.SaveChangesAsync();
    }

    public async Task<IEnumerable<Sale>> GetAsync(SaleGetRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        (await _saleValidator.ValidateGetRequestAsync(request.InstanceId)).AssertValid();
        
        return (await _database.Sales
                .Include(it => it.Customer)
                .Include(it => it.Salesman)
                .Include(it => it.SoldGoods)
                .Where(it => !it.IsDeleted && it.InstanceId == request.InstanceId)
                .ToListAsync())
            .Also(
                sales => sales.ForEach(
                    s => s.SoldGoods = s.SoldGoods
                        .Where(it => !it.IsDeleted)
                        .ToList()
                )
            );
    }

    public async Task<Sale> GetByIdAsync(int id)
    {
        // Validate if sale exists
        // Validate if requester can access (HIGHER LEVEL)
        (await _saleValidator.ValidateGetByIdRequestAsync(id)).AssertValid();

        return (await _database.Sales
                .Include(it => it.Customer)
                .Include(it => it.Salesman)
                .Include(it => it.SoldGoods)
                .FirstAsync(it => it.Id == id && !it.IsDeleted))
            .Also(
                s => s.SoldGoods = s.SoldGoods
                    .Where(it => !it.IsDeleted)
                    .ToList()
            );
    }
}