namespace Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

public class SubmitDeclarationCustomer
{
    /// <summary>
    ///     Buyer's date of birth.
    /// </summary>
    public required DateTime BirthDate { get; set; }

    /// <summary>
    ///     Buyer's first name
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    ///     Buyer's identity document.
    /// </summary>
    public required SubmitDeclarationIdentityDocument IdentityDocument { get; set; }

    /// <summary>
    ///     Buyer's last name
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    ///     Other documents that can prove that the buyer is a resident of a non-EU country
    ///     to be able to apply 0% VAT rate.
    /// </summary>
    public IReadOnlyList<SubmitDeclarationOtherDocument> OtherDocument { get; set; }

    /// <summary>
    ///     Buyer's personal identification number from their country.
    ///     If it cannot be provided (since country isn't using such system),
    ///     then it shouldn't be filled.
    /// </summary>
    public SubmitDeclarationPersonId PersonId { get; set; }

    /// <summary>
    ///     If buyer is a resident of a non-EU country, then this field should be filled.
    /// </summary>
    public NonEuCountryCode? ResidentCountryCode { get; set; }

    /// <summary>
    ///     If buyer provides other documents that were provided by EU country,
    ///     then this field should be filled to provide 3rd EU territory information
    ///     in that EU country.
    /// </summary>
    public SubmitDeclarationCustomerResidenceTerritory? ResidentTerritory { get; set; }
}