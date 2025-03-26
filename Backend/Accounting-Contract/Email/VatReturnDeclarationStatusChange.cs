using System.Net.Mail;
using System.Net.Mime;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Email;

public class VatReturnDeclarationStatusChange : IEmailForm
{
    public ICollection<Attachment> Attachments { get; }
    public string Body { get; }

    private string Html => """
                           <div>
                             <div style="margin-left: auto; margin-right: auto; max-width: 28rem; overflow: hidden; border-radius: 0.5rem; background-color: #fff; --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">
                               <div style="background-color: {{Color}}; padding-top: 16px; padding-bottom: 16px; text-align: center; color: #fff;">
                                 <h1 style="font-weight: 700;">Status Change</h1>
                                 <h2 style="font-size: 20px; font-weight: 700;">VAT Return Declaration</h2>
                               </div>
                           
                               <div style="padding: 24px;">
                                 <p style="color: #374151;">Dear Customer,</p>
                                 <p style="margin-top: 16px; color: #374151;">
                                   Your VAT return declaration with ID <strong>{{Id}}</strong> has changed
                                   status to <strong>{{Status}}</strong>.
                                 </p>
                                 <p style="margin-top: 16px; color: #374151;">
                                   Please find the QR codes below for more details.
                                 </p>
                                 <p style="margin-top: 16px; color: #374151;">Thank you for using our services.</p>
                               </div>
                             </div>
                           </div>
                           """;

    public bool IsHtml { get; } = true;

    public string Subject { get; }

    public VatReturnDeclarationStatusChange(StiVatReturnDeclaration declaration)
    {
        var color = declaration.State != SubmitDeclarationState.REJECTED ? "#22c55e" : "#ef4444";

        var statusText = declaration.State switch
        {
            SubmitDeclarationState.REJECTED => "Atmesta (Rejected)",
            _ => "Priimta (Accepted)"
        };

        Attachments = declaration.QrCodes
            .Select(
                (it, index) =>
                {
                    var bytes = Convert.FromBase64String(it.Value);
                    var stream = new MemoryStream(bytes);

                    return new Attachment(stream, $"QR Code Chunk #{index + 1}.png", MediaTypeNames.Image.Png);
                }
            )
            .ToList();

        Body = BuildBody(
            color,
            declaration.Id,
            statusText
        );

        Subject = $"VAT Return Declaration - {declaration.Id} - Status Change";
    }

    private string BuildBody(string color, string id, string status) => Html
        .Replace("{{Color}}", color)
        .Replace("{{Id}}", id)
        .Replace("{{Status}}", status);
}