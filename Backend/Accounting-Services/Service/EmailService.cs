using System.Net;
using System.Net.Mail;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;

namespace Accounting.Services.Service;

public class EmailService : IEmailService
{
    private readonly Email _email;

    public EmailService(Email email)
    {
        _email = email;
    }

    public async Task SendAsync(
        string toEmail,
        string subject,
        string body,
        ICollection<Attachment> attachments,
        bool isHtml = true
    )
    {
        using var client = new SmtpClient(_email.Host, _email.Port);

        client.Credentials = new NetworkCredential(_email.Username, _email.Password);
        client.EnableSsl = _email.EnableSsl;

        using var message = new MailMessage();

        message.From = new MailAddress(_email.FromEmail, _email.FromName);
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = isHtml;

        message.To.Add(toEmail);

        foreach (var attachment in attachments)
        {
            message.Attachments.Add(attachment);
        }

        await client.SendMailAsync(message);
    }
}