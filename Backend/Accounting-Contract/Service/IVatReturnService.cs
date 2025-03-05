using Accounting.Contract.Dto.StiVatReturn;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    /// <summary>
    /// Submits VTA refund declaration to STI API.
    /// </summary>
    /// <param name="request">Request to handle for response</param>
    /// <returns>Declaration submit response</returns>
    public Task<StiVatReturnDeclaration> SubmitAsync(
        StiVatReturnDeclarationSubmitRequest request
    );

    /// <summary>
    /// Gets VTA refund declaration from STI API by the given request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Submitted customer's declarations</returns>
    public Task<IEnumerable<StiVatReturnDeclaration>> GetByCustomerAsync(
        StiVatReturnDeclarationGetByCustomerRequest request
    );

    /// <summary>
    /// Gets VTA refund declaration from STI API by the given request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Submitted declarations</returns>
    public Task<IEnumerable<StiVatReturnDeclaration>> GetAsync(
        StiVatReturnDeclarationGetRequest request
    );
}