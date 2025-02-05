namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationCustomer
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public SubmitDeclarationPersonId PersonId { get; set; }
    public DateTime BirthDate { get; set; }
    public SubmitDeclarationIdentityDocument IdentityDocument { get; set; }
    public IReadOnlyList<SubmitDeclarationOtherDocument> OtherDocument { get; set; }
    public NonEuCountryCode? ResidentCountryCode { get; set; }
    public SubmitDeclarationCustomerResidenceTerritory? ResidentTerritory { get; set; }
}