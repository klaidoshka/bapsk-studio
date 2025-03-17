using Accounting.Contract.Dto.Sti.VatReturn;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    /// <summary>
    /// Get specified sale's VTA return declaration
    /// </summary>
    /// <param name="saleId"></param>
    /// <returns>Declaration of specified sale or null if not found</returns>
    public Task<StiVatReturnDeclaration?> GetBySaleIdAsync(int saleId);

    /// <summary>
    /// Submits VTA return declaration to STI API. Authorization validation must be executed beforehand.
    /// </summary>
    /// <param name="request">Request to handle for response</param>
    /// <returns>Declaration submit response</returns>
    public Task<StiVatReturnDeclaration> SubmitAsync(StiVatReturnDeclarationSubmitRequest request);
}