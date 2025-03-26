using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

namespace Accounting.Contract.Email;

public static class Emails
{
    public static IEmailForm VatReturnDeclarationStatusChange(
        string declarationId,
        SubmitDeclarationState status,
        ICollection<string> qrCodes
    ) => new VatReturnDeclarationStatusChange(
        declarationId,
        status,
        qrCodes
    );
}