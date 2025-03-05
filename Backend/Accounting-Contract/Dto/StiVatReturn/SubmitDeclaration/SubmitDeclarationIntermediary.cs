namespace Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

public class SubmitDeclarationIntermediary
{
    /// <summary>
    ///     Service intermediary identification number.
    ///     9 characters for individuals,
    ///     10 characters for Sti identification number,
    ///     10 characters for foreigner identification number,
    ///     6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string IntermediaryId { get; set; }

    /// <summary>
    ///     Intermediary name, 300 characters.
    /// </summary>
    public required string Name { get; set; }
}