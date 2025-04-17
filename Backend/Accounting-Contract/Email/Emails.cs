using Accounting.Contract.Entity;

namespace Accounting.Contract.Email;

public static class Emails
{
    public static IEmailForm VatReturnDeclarationStatusChange(StiVatReturnDeclaration declaration, string previewCode, string endpoint) =>
        new VatReturnDeclarationStatusChange(declaration, previewCode, endpoint);

    public static IEmailForm ResetPasswordRequest(string token, string endpoint) => new ResetPasswordRequest(token, endpoint);
}