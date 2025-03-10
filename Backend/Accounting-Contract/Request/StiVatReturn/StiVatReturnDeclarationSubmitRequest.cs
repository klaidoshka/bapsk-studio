namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequest
{
    public bool Affirmation { get; set; }
    public int? InstanceId { get; set; }
    public int? RequesterId { get; set; }
    public StiVatReturnDeclarationSubmitRequestSale Sale { get; set; }
}