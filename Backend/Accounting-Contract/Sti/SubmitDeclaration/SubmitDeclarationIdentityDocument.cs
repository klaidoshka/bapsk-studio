namespace Accounting.Contract.Sti.SubmitDeclaration;

public class SubmitDeclarationIdentityDocument
{
    /// <summary>
    /// Document number.
    /// </summary>
    public required SubmitDeclarationIdDocumentNo DocumentNo { get; set; }

    /// <summary>
    /// Document type code, 1 digit.
    /// 1 - Passport
    /// 2 - National ID
    /// </summary>
    public required int DocumentType { get; set; }
}