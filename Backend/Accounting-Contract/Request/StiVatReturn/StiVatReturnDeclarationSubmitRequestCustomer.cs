namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestCustomer
{
    public DateTime Birthdate { get; set; } = DateTime.UtcNow;
    public string FirstName { get; set; } = String.Empty;
    public int? Id { get; set; }

    public StiVatReturnDeclarationSubmitRequestCustomerIdentityDocument IdentityDocument
    {
        get;
        set;
    } = new();

    public string LastName { get; set; } = String.Empty;
}