#region

#endregion

using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationIdentityDocument
{
    public required SubmitDeclarationIdDocumentNo DocumentNo { get; set; }
    public required IdentityDocumentType DocumentType { get; set; }
}