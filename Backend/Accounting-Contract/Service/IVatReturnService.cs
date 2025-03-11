using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    /// <summary>
    /// Submits VTA refund declaration to STI API. Authorization validation must be executed beforehand.
    /// </summary>
    /// <param name="request">Request to handle for response</param>
    /// <returns>Declaration submit response</returns>
    public Task<StiVatReturnDeclaration> SubmitAsync(StiVatReturnDeclarationSubmitRequest request);
}