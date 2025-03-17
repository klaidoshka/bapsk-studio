using Accounting.Contract.Dto.Sti.VatReturn;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    /// <summary>
    /// Generates QR code for VTA return declaration summary
    /// </summary>
    /// <param name="declaration">Declaration to serialize into QR codes for preview in customs</param>
    /// <returns>Single or multiple QR codes in Base64 format for singular declaration</returns>
    public IEnumerable<string> GenerateQrCodes(StiVatReturnDeclaration declaration);
    
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