namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestSalesman
{
    public int? Id { get; set; }
    public string Name { get; set; } = String.Empty;

    public StiVatReturnDeclarationSubmitRequestSalesmanVatPayerCode VatPayerCode { get; set; } =
        new();
}