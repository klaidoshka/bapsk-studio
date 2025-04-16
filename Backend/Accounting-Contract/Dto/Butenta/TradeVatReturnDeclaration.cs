using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

namespace Accounting.Contract.Dto.Butenta;

public class TradeVatReturnDeclaration
{
    public int CorrectionNo { get; set; }
    public string DeclarationId { get; set; }
    public SubmitDeclarationState? DeclarationState { get; set; }
    public IList<string>? Errors { get; set; }
    public IList<string> QrCodes { get; set; }
    public DateTime SubmitDate { get; set; }
}