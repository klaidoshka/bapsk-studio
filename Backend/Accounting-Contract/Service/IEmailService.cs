using System.Net.Mail;
using Accounting.Contract.Email;

namespace Accounting.Contract.Service;

public interface IEmailService
{
    public Task SendAsync(string toEmail, string subject, string body, ICollection<Attachment> attachments, bool isHtml = true);

    public Task SendAsync(string toEmail, IEmailForm form) => SendAsync(toEmail, form.Subject, form.Body, form.Attachments, form.IsHtml);
}