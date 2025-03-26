using System.Net.Mail;

namespace Accounting.Contract.Email;

public interface IEmailForm
{
    public ICollection<Attachment> Attachments { get; }
    public string Body { get; }
    public bool IsHtml { get; }
    public string Subject { get; }
}