namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationCustomer
{
    public required DateTime BirthDate { get; set; }
    public required string FirstName { get; set; }
    public required SubmitDeclarationIdentityDocument IdentityDocument { get; set; }
    public required string LastName { get; set; }
    public IReadOnlyList<SubmitDeclarationOtherDocument> OtherDocuments { get; set; } = new List<SubmitDeclarationOtherDocument>();
    public SubmitDeclarationPersonId? PersonId { get; set; }
    public NonEuCountryCode? ResidentCountryCode { get; set; }
    public SubmitDeclarationCustomerResidenceTerritory? ResidentTerritory { get; set; }
}