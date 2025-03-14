using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Service;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Sale = Accounting.Contract.Entity.Sale;

namespace Accounting.Services.Service;

public class SaleService : ISaleService
{
    private readonly AccountingDatabase _database;

    public SaleService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Sale> CreateAsync(SaleCreateRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate properties

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
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate if sale exists

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
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate if sale exists
        // Validate properties

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
                        it.VatRate = soldGood.VatRate;
                        it.TaxableAmount = soldGood.Quantity * soldGood.UnitPrice;
                        it.VatAmount = it.TaxableAmount * soldGood.VatRate / 100;
                        it.TotalAmount = it.TaxableAmount + it.VatAmount;
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
        // Validate if instance exists
        // Validate if requester can access the instance

        if (request.InstanceId is not null)
        {
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

        var instanceIds = await _database.InstanceUserMetas
            .Where(it => it.UserId == request.RequesterId)
            .Select(it => it.InstanceId)
            .ToHashSetAsync();

        return (await _database.Sales
                .Include(it => it.Customer)
                .Include(it => it.Salesman)
                .Include(it => it.SoldGoods)
                .Where(
                    it => !it.IsDeleted &&
                          it.InstanceId != null
                )
                .ToListAsync())
            .Where(it => instanceIds.Contains(it.InstanceId!.Value))
            .ToList()
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
        return (await _database.Sales
                .Include(it => it.Customer)
                .Include(it => it.Salesman)
                .Include(it => it.SoldGoods)
                .FirstOrDefaultAsync(it => it.Id == id && !it.IsDeleted))
            ?.Also(
                s => s.SoldGoods = s.SoldGoods
                    .Where(it => !it.IsDeleted)
                    .ToList()
            ) ?? throw new ValidationException("Sale not found");
    }
}