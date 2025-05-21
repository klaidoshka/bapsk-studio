namespace Accounting.Contract.Configuration;

public class Email
{
    public bool EnableSsl { get; set; }
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "";
    public string Host { get; set; } = "";
    public string Password { get; set; } = "";
    public int Port { get; set; } 
    public Resend Resend { get; set; } = new();
    public EmailResetPassword ResetPassword { get; set; } = new();
    public string Username { get; set; } = "";
    public VatReturnStatusChange VatReturnStatusChange { get; set; } = new();
}

public class EmailResetPassword
{
    public string Endpoint { get; set; } = "";
    public string Secret { get; set; } = "";
}

public class Resend
{
    public string ApiKey { get; set; } = "";
    public bool Enabled { get; set; }
}

public class VatReturnStatusChange
{
    public string Endpoint { get; set; } = "";
}