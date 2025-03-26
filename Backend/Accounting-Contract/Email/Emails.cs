using Accounting.Contract.Entity;

namespace Accounting.Contract.Email;

public static class Emails
{
    public static IEmailForm VatReturnDeclarationStatusChange(StiVatReturnDeclaration declaration) =>
        new VatReturnDeclarationStatusChange(declaration);
}