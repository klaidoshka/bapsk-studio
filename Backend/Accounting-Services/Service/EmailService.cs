using System.Net;
using System.Net.Mail;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;
using Microsoft.Extensions.Logging;

namespace Accounting.Services.Service;

public class EmailService : IEmailService
{
    private readonly Email _email;
    private readonly ILogger<EmailService> _logger;

    public EmailService(Email email, ILogger<EmailService> logger)
    {
        _email = email;
        _logger = logger;
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

        try
        {
            await client.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error sending email: {Message}", ex.Message);
        }
    }
}