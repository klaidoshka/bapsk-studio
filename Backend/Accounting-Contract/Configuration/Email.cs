namespace Accounting.Contract.Configuration;

public class Email
{
    public bool EnableSsl { get; set; }
    public string FromEmail { get; set; }
    public string FromName { get; set; }
    public string Host { get; set; }
    public string Password { get; set; }
    public int Port { get; set; }
    public EmailResetPassword ResetPassword { get; set; }
    public string Username { get; set; }
    public VatReturnStatusChange VatReturnStatusChange { get; set; }
}

public class EmailResetPassword
{
    public string Endpoint { get; set; }
    public string Secret { get; set; }
}

public class VatReturnStatusChange
{
    public string Endpoint { get; set; }
}