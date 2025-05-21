using System.Net.Mail;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;
using Microsoft.Extensions.Logging;
using Resend;

namespace Accounting.Services.Service;

public class ResendEmailService : IEmailService
{
    private readonly Email _email;
    private readonly ILogger<ResendEmailService> _logger;
    private readonly IResend _resend;

    public ResendEmailService(
        Email email,
        ILogger<ResendEmailService> logger,
        IResend resend
    )
    {
        _email = email;
        _logger = logger;
        _resend = resend;
    }

    public async Task SendAsync(
        string toEmail,
        string subject,
        string body,
        ICollection<Attachment> attachments,
        bool isHtml = true
    )
    {
        var message = new EmailMessage
        {
            From = _email.FromEmail,
            Subject = subject,
            To = toEmail
        };

        message.Attachments = attachments
            .Select((attachment, index) =>
                {
                    var bytes = new byte[attachment.ContentStream.Length];

                    attachment.ContentStream.ReadExactly(bytes);

                    return new EmailAttachment
                    {
                        Content = bytes,
                        ContentType = attachment.ContentType.ToString(),
                        Filename = attachment.Name ?? attachment.ContentDisposition?.FileName ?? $"attachment_{index + 1}"
                    };
                }
            )
            .ToList();

        if (isHtml)
        {
            message.HtmlBody = body;
        }
        else
        {
            message.TextBody = body;
        }

        try
        {
            await _resend.EmailSendAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error sending email: {Message}", ex.Message);
        }
    }
}