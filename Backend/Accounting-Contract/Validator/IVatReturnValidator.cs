using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Dto.Sti.VatReturn;

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
        Customer customer
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request sale.
    /// </summary>
    /// <param name="sale">Sale to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestSaleAsync(
        Sale sale
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request salesman.
    /// </summary>
    /// <param name="salesman">Salesman to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestSalesmanAsync(
        Salesman salesman
    );

    /// <summary>
    /// Validate the VTA refund declaration submit request sold good.
    /// </summary>
    /// <param name="soldGood">Sold good to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestSoldGoodAsync(
        SoldGood soldGood
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