using System.Net.Mail;

namespace Accounting.Contract.Email;

public class ResetPasswordRequest : IEmailForm
{
    public ICollection<Attachment> Attachments { get; } = [];

    public string Body { get; }

    private string Html => """
                           <div style="display: flex; align-items: center; justify-content: center;">
                           <div style="max-width: 28rem; border-radius: 0.5rem; background-color: #fff; padding: 24px; text-align: center; --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">
                               <h2 style="margin-bottom: 16px; font-size: 20px; font-weight: 600; color: #1f2937;">Reset Your Password</h2>
                               <p style="margin-bottom: 24px; color: #4b5563;">We have received a request to reset your password.</p>
                               <p style="margin-bottom: 24px; color: #4b5563;">If you didn't make this request, you can safely ignore this email. Otherwise, please click the button below to reset your password.</p>
                               <a href="{{Endpoint}}?token={{Token}}" style="display: inline-block; border-radius: 0.25rem; background-color: #18181b; padding-left: 16px; padding-right: 16px; padding-top: 8px; padding-bottom: 8px; font-weight: 500; color: #fff;">Reset Password</a>
                               <p style="margin-top: 24px; color: #4b5563;">
                               You can also copy and paste the following link into your browser:
                               <a href="{{Endpoint}}?token={{Token}}" style="color: #3b82f6;">{{Endpoint}}?token={{Token}}</a>
                               </p>
                           </div>
                           </div>
                           """;

    public bool IsHtml { get; } = true;
    public string Subject { get; }

    public ResetPasswordRequest(string token, string endpoint)
    {
        Body = BuildBody(token, endpoint);
        Subject = "Reset Password Request";
    }

    private string BuildBody(string token, string endpoint)
    {
        return Html
            .Replace("{{Token}}", token)
            .Replace("{{Endpoint}}", endpoint);
    }
}