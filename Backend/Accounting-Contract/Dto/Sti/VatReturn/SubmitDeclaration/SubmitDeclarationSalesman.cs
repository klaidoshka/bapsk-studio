namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationSalesman
{
    /// <summary>
    ///     Salesman's name.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    ///     VAT payer code of the salesman.
    /// </summary>
    public required SubmitDeclarationLtVatPayerCode VatPayerCode { get; set; }
}