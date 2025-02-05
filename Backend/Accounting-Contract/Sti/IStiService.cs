using Accounting.Contract.Sti.Data;
using Accounting.Contract.Sti.Data.CancelDeclaration;
using Accounting.Contract.Sti.Data.ExportedGoods;
using Accounting.Contract.Sti.Data.QueryDeclarations;
using Accounting.Contract.Sti.Data.SubmitDeclaration;
using Accounting.Contract.Sti.Data.SubmitPaymentInfo;

namespace Accounting.Contract.Sti;

/// <summary>
/// Service responsible for interacting with the STI API via Client.
/// </summary>
public interface IStiService
{
    public Task<CancelDeclarationResponse> CancelDeclarationAsync(CancelDeclarationRequest request);

    public Task<ExportedGoodsResponse> GetInfoOnExportedGoodsAsync(ExportedGoodsRequest request);

    public Task<QueryDeclarationsResponse> QueryDeclarationsAsync(QueryDeclarationsRequest request);

    public Task<SubmitDeclarationResponse> SubmitDeclarationAsync(SubmitDeclarationRequest request);

    public Task<SubmitPaymentInfoResponse> SubmitPaymentInfoAsync(SubmitPaymentInfoRequest request);
}