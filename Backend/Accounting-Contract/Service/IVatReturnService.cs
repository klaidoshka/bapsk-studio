using Accounting.Contract.Dto.Sti.VatReturn;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    public Task<string> GenerateDeclarationIdAsync();

    public IEnumerable<string> GenerateQrCodes(StiVatReturnDeclaration declaration);

    public Task<StiVatReturnDeclaration?> GetBySaleIdAsync(int saleId);

    public Task<StiVatReturnDeclaration> SubmitAsync(StiVatReturnDeclarationSubmitRequest request);
}