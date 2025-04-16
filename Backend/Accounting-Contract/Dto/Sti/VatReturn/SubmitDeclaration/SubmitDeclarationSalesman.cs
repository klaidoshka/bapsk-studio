namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationSalesman
{
    public required string Name { get; set; }
    public required SubmitDeclarationLtVatPayerCode VatPayerCode { get; set; }
}