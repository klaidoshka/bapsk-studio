namespace Accounting.Contract.Configuration;

public class Email
{
    public bool EnableSsl { get; set; }
    public string FromEmail { get; set; }
    public string FromName { get; set; }
    public string Host { get; set; }
    public string Password { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
}