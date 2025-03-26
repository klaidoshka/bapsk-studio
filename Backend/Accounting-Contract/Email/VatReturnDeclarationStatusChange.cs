using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

namespace Accounting.Contract.Email;

public class VatReturnDeclarationStatusChange : IEmailForm
{
    public string Body { get; }

    private string Html => """
                           <div>
                             <div class="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                               <div class="bg-{{Color}}-500 text-white text-center py-4">
                                 <h1 class="text-l font-bold">Status Change</h1>
                                 <h2 class="text-xl font-bold">VAT Return Declaration</h2>
                               </div>
                           
                               <div class="p-6">
                                 <p class="text-gray-700">Dear Customer,</p>
                                 <p class="text-gray-700 mt-4">Your VAT return declaration with ID <strong>{{DeclarationId}}</strong> has changed status
                                   to <strong>{{Status}}</strong>.</p>
                                 <p class="text-gray-700 mt-4">Please find the QR codes below for more details:</p>
                           
                                 <div class="mt-4 flex flex-wrap justify-center">
                                   {{QrCodes}}
                                 </div>
                           
                                 <p class="text-gray-700 mt-4">Thank you for using our services.</p>
                               </div>
                             </div>
                           </div>
                           """;

    public bool IsHtml { get; } = true;

    public string Subject { get; }

    public VatReturnDeclarationStatusChange(string declarationId, SubmitDeclarationState status, ICollection<string> qrCodes)
    {
        var color = status != SubmitDeclarationState.REJECTED ? "green" : "red";

        var statusText = status switch
        {
            SubmitDeclarationState.REJECTED => "Atmesta (Rejected)",
            _ => "Priimta (Accepted)"
        };

        var qrCodesHtml = String.Join(
            "",
            qrCodes.Select(
                (it, index) =>
                    $"<div class=\"w-1/2 p-2\">" +
                    $"<img src=\"data:image/jpeg;base64,{it}\" alt=\"{"QR Code Chunk #" + (index + 1)}\" class=\"w-full h-auto\">" +
                    $"</div>"
            )
        );

        Body = BuildBody(
            color,
            declarationId,
            statusText,
            qrCodesHtml
        );

        Subject = $"VAT Return Declaration - {declarationId} - Status Change";
    }

    private string BuildBody(string color, string id, string status, string qrCodes) => Html
        .Replace("{{Color}}", color)
        .Replace("{{Id}}", id)
        .Replace("{{Status}}", status)
        .Replace("{{QrCodes}}", qrCodes);
}