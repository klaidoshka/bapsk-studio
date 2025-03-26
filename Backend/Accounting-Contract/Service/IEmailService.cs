namespace Accounting.Contract.Service;

public interface IEmailService
{
    public Task SendAsync(string toEmail, string subject, string body, bool isHtml = true);
}