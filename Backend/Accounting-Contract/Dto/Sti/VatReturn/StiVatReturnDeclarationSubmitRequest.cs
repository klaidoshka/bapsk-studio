namespace Accounting.Contract.Dto.Sti.VatReturn;

public class StiVatReturnDeclarationSubmitRequest
{
    public bool Affirmation { get; set; }
    public string? DeclarationId { get; set; }
    public int? InstanceId { get; set; }
    public int? RequesterId { get; set; }
    public Sale.Sale? Sale { get; set; }
}