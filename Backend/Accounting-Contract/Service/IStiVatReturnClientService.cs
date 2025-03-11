using Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

namespace Accounting.Contract.Service;

/// <summary>
/// Service responsible for interacting with the STI API via Client.
/// </summary>
public interface IStiVatReturnClientService
{
    /// <summary>
    /// Cancels declaration with specified request via STI API.
    /// </summary>
    /// <param name="request">Request to handle for response</param>
    /// <returns>In-progress task that resolves into operation's response</returns>
    public Task<CancelDeclarationResponse> CancelDeclarationAsync(CancelDeclarationRequest request);

    /// <summary>
    /// Gets information on exported goods with specified request via STI API.
    /// </summary>
    /// <param name="request">Request to handle for response</param>
    /// <returns>In-progress task that resolves into operation's response</returns>
    public Task<ExportedGoodsResponse> GetInfoOnExportedGoodsAsync(ExportedGoodsRequest request);

    /// <summary>
    /// Submits VTA refund declaration to STI API.
    /// </summary>
    /// <param name="request">Request to handle for response</param>
    /// <returns>In-progress task that resolves into operation's response</returns>
    public Task<SubmitDeclarationResponse> SubmitDeclarationAsync(SubmitDeclarationRequest request);
}