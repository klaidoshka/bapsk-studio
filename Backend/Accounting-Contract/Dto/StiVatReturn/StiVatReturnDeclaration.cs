using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class StiVatReturnDeclaration
{
    public string DocumentId { get; set; }
    public DateTime Date { get; set; }
    public int SaleId { get; set; }
    public SubmitDeclarationState State { get; set; }
}