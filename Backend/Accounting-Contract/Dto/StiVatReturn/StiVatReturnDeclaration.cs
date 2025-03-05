using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class StiVatReturnDeclaration
{
    public SubmitDeclarationState DeclarationState { get; set; }
    public string DocumentId { get; set; }
    public Sale Sale { get; set; }
    public DateTime ResultDate { get; set; }
}