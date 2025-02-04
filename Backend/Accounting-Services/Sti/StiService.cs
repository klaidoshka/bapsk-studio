using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using Accounting.Contract.Configuration;
using Accounting.Contract.Sti;
using Accounting.Contract.Sti.Data;
using Accounting.Services.Sti.Mapping;

namespace Accounting.Services.Sti;

public class StiService : IStiService
{
    private readonly VATRefundforForeignTravelerTRPortClient _client;

    public StiService(
        CertificateSerialNumbers certificateSerialNumbers,
        Endpoints endpoints
    )
    {
        _client = CreateClient(certificateSerialNumbers, endpoints);
    }

    public async Task<CancelDeclarationResponse> CancelDeclarationAsync(
        CancelDeclarationRequest request
    )
    {
        return (await _client.cancelDeclarationAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<ExportedGoodsResponse> GetInfoOnExportedGoodsAsync(
        ExportedGoodsRequest request
    )
    {
        return (await _client.getInfoOnExportedGoodsAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<QueryDeclarationsResponse> QueryDeclarationsAsync(
        QueryDeclarationsRequest request
    )
    {
        return (await _client.queryDeclarationsAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<SubmitDeclarationResponse> SubmitDeclarationAsync(
        SubmitDeclarationRequest request
    )
    {
        return (await _client.submitDeclarationAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<SubmitPaymentInfoResponse> SubmitPaymentInfoAsync(
        SubmitPaymentInfoRequest request
    )
    {
        return (await _client.submitPaymentInfoAsync(request.ToExternalType()))
            .ToInternalType();
    }

    private static VATRefundforForeignTravelerTRPortClient CreateClient(
        CertificateSerialNumbers certificateSerialNumbers,
        Endpoints endpoints
    )
    {
        if (certificateSerialNumbers.StiVatRefund is null || endpoints.StiVatRefund is null)
        {
            throw new InvalidOperationException(
                "STI VAT Refund certificate serial number or endpoint is not configured"
            );
        }

        var client = new VATRefundforForeignTravelerTRPortClient(
            new BasicHttpsBinding
            {
                Security = new BasicHttpsSecurity
                {
                    Transport = new HttpTransportSecurity
                    {
                        ClientCredentialType = HttpClientCredentialType.Certificate
                    }
                }
            },
            new EndpointAddress(endpoints.StiVatRefund)
        );

        client.ClientCredentials.ClientCertificate.SetCertificate(
            StoreLocation.LocalMachine,
            StoreName.My,
            X509FindType.FindBySerialNumber,
            certificateSerialNumbers.StiVatRefund
        );

        return client;
    }
}