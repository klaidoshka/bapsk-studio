using Accounting.Contract;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;
using Accounting.Contract.Enumeration;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
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

    public async Task<Validation> ValidateSubmitRequestAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        if (!request.Affirmation)
        {
            return new Validation(
                "You must affirm that the customer can be refunded before submitting."
            );
        }

        var instance = await _database.Instances
            .Include(i => i.UserMetas)
            .FirstOrDefaultAsync(i => i.Id == request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance not found.");
        }

        if (instance.UserMetas.All(um => um.UserId != request.RequesterId))
        {
            return new Validation(
                "You are not authorized to submit declaration for this instance."
            );
        }

        var declaration = await _database.StiVatReturnDeclarations.FirstOrDefaultAsync(
            d => d.SaleId == request.Sale.Id
        );

        if (declaration != null && declaration.State == SubmitDeclarationState.ACCEPTED_CORRECT)
        {
            return new Validation("Declaration is already submitted and accepted.");
        }

        var customer = await _database.DataEntries
            .Include(de => de.DataType)
            .Where(
                de => de.DataType.InstanceId == instance.Id &&
                      de.DataType.Type == DataTypeType.Customer
            )
            .FirstOrDefaultAsync(customer => customer.Id == request.Sale.Customer.Id);

        if (customer == null)
        {
            return new Validation("Customer not found.");
        }

        var sale = await _database.DataEntries
            .Include(de => de.DataType)
            .Where(
                de => de.DataType.InstanceId == instance.Id && de.DataType.Type == DataTypeType.Sale
            )
            .FirstOrDefaultAsync(sale => sale.Id == request.Sale.Id);

        if (sale == null)
        {
            return new Validation("Sale not found.");
        }

        var salesman = await _database.DataEntries
            .Include(de => de.DataType)
            .Where(
                de => de.DataType.InstanceId == instance.Id &&
                      de.DataType.Type == DataTypeType.Salesman
            )
            .FirstOrDefaultAsync(salesman => salesman.Id == request.Sale.Salesman.Id);

        if (salesman == null)
        {
            return new Validation("Salesman not found.");
        }

        var goods = await _database.DataEntries
            .Include(de => de.DataType)
            .Where(
                de => de.DataType.InstanceId == instance.Id &&
                      de.DataType.Type == DataTypeType.Good &&
                      de.DataType.Fields.Any(f => f.ReferenceId == sale.DataTypeId)
            )
            .ToListAsync();

        return goods.Count == 0 ? new Validation("No goods to declare.") : new Validation();
    }

    public async Task<Validation> ValidateGetByCustomerRequestAsync(
        StiVatReturnDeclarationGetByCustomerRequest request
    )
    {
        var instance = await _database.Instances
            .Include(i => i.UserMetas)
            .FirstOrDefaultAsync(i => i.Id == request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance not found.");
        }

        if (instance.UserMetas.All(um => um.UserId != request.RequesterId))
        {
            return new Validation(
                "You are not authorized to get declarations for this instance."
            );
        }

        var customer = await _database.DataEntries
            .Include(de => de.DataType)
            .Where(
                de => de.DataType.InstanceId == instance.Id &&
                      de.DataType.Type == DataTypeType.Customer
            )
            .FirstOrDefaultAsync(customer => customer.Id == request.CustomerId);

        return customer == null ? new Validation("Customer not found.") : new Validation();
    }

    public async Task<Validation> ValidateGetRequestAsync(StiVatReturnDeclarationGetRequest request)
    {
        var instance = await _database.Instances
            .Include(i => i.UserMetas)
            .FirstOrDefaultAsync(i => i.Id == request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance not found.");
        }

        if (instance.UserMetas.All(um => um.UserId != request.RequesterId))
        {
            return new Validation(
                "You are not authorized to get declarations for this instance."
            );
        }

        return new Validation();
    }
}