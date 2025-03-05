using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IVatReturnValidator
{
    /// <summary>
    /// Validates the given request for VTA refund declaration submission.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSubmitRequestAsync(
        StiVatReturnDeclarationSubmitRequest request
    );

    /// <summary>
    /// Validates the given request for VTA refund declaration fetching by customer.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateGetByCustomerRequestAsync(
        StiVatReturnDeclarationGetByCustomerRequest request
    );

    /// <summary>
    /// Validates the given request for VTA refund declaration fetching.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateGetRequestAsync(StiVatReturnDeclarationGetRequest request);
}