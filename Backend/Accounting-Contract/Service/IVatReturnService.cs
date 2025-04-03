using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Entity;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Contract.Service;

public interface IVatReturnService
{
    public Task<string> GenerateDeclarationIdAsync();

    public string GenerateDeclarationPreviewCode(StiVatReturnDeclaration declaration);

    public IEnumerable<string> GenerateQrCodes(StiVatReturnDeclaration declaration);

    public Task<StiVatReturnDeclaration?> GetByPreviewCodeAsync(string code);

    public Task<StiVatReturnDeclaration?> GetBySaleIdAsync(int saleId);
    
    public Task<Sale> MapButentaTradeToSaleAsync(int tradeId);

    public PreviewCodeValues ReadPreviewCodeValues(string code);

    public Task<StiVatReturnDeclaration> SubmitAsync(StiVatReturnDeclarationSubmitRequest request);

    public Task<StiVatReturnDeclaration> SubmitButentaTradeAsync(int tradeId);

    public Task UpdateButentaTradeAsync(int tradeId);
}