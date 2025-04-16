namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationCustomerResidenceTerritory
{
    // EU 3rd territory code from classification standard, 4 characters.
    // https://www.vmi.lt/evmi/documents/20142/696706/PVM+gr%C4%85%C5%BEinimo+keleiviams+main%C5%B3+su+prekybininkais+specifikacija+v0.15.pdf/7af768cc-8dd5-9e82-41b2-5d24e68c9063?t=1662117213923#page=45
    public required string TerritoryCode { get; set; }
    public required string TerritoryName { get; set; }
}