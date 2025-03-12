using Accounting.Contract.Dto.Sti.VatReturn;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    /// <summary>
    /// Gets VTA return declarations for specified instance. If instance id is null, returns all instance-less declarations.
    /// </summary>
    /// <param name="instanceId">Instance id</param>
    /// <returns>Declarations of instance</returns>
    public Task<IEnumerable<StiVatReturnDeclaration>> GetAsync(int? instanceId);

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