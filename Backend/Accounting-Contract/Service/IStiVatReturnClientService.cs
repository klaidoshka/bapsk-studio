using Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

namespace Accounting.Contract.Service;

/// <summary>
/// Service responsible for interacting with the STI API via Client.
/// </summary>
public interface IStiVatReturnClientService
{
    public Task<CancelDeclarationResponse> CancelDeclarationAsync(CancelDeclarationRequest request);
    
    public Task<ExportedGoodsResponse> GetInfoOnExportedGoodsAsync(ExportedGoodsRequest request);
    
    public Task<SubmitDeclarationResponse> SubmitDeclarationAsync(SubmitDeclarationRequest request);
}