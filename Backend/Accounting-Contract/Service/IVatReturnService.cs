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
    public Task<StiVatReturnDeclaration> SubmitAsync(StiVatReturnDeclarationSubmitRequest request);
}