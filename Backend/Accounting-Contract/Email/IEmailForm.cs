namespace Accounting.Contract.Email;

public interface IEmailForm
{
    public string Body { get; }
    public bool IsHtml { get; }
    public string Subject { get; }
}