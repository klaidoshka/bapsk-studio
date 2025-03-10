using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IVatReturnValidator
{
    /// <summary>
    /// Validates the given request for VTA refund declaration submission.
    /// It is expected that the request is validated for authorization before this method is called.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestAsync(
        StiVatReturnDeclarationSubmitRequest request
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request customer.
    /// </summary>
    /// <param name="customer">Customer to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestCustomerAsync(
        StiVatReturnDeclarationSubmitRequestCustomer customer
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request sale.
    /// </summary>
    /// <param name="sale">Sale to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestSaleAsync(
        StiVatReturnDeclarationSubmitRequestSale sale
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request salesman.
    /// </summary>
    /// <param name="salesman">Salesman to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestSalesmanAsync(
        StiVatReturnDeclarationSubmitRequestSalesman salesman
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request sold good.
    /// </summary>
    /// <param name="soldGood">Sold good to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestSoldGoodAsync(
        StiVatReturnDeclarationSubmitRequestSoldGood soldGood
    );

    /// <summary>
    /// Validates the given request for VTA refund declaration submission authorization.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestAuthorizationAsync(
        StiVatReturnDeclarationSubmitRequest request
    );
}