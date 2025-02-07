using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;
using Accounting.Contract.Sti.CancelDeclaration;
using Accounting.Contract.Sti.ExportedGoods;
using Accounting.Contract.Sti.QueryDeclarations;
using Accounting.Contract.Sti.SubmitDeclaration;
using Accounting.Contract.Sti.SubmitPaymentInfo;
using Accounting.Services.Sti;
using Accounting.Services.Sti.Mapping;

namespace Accounting.Services.Service;

public class StiService : IStiService, IAsyncDisposable
{
    private readonly VATRefundforForeignTravelerTRPortClient _client;

    public StiService(
        CertificateSerialNumbers certificateSerialNumbers,
        Endpoints endpoints,
        Logging logging
    )
    {
        _client = CreateClient(certificateSerialNumbers, endpoints, logging);
    }

    public async Task<CancelDeclarationResponse> CancelDeclarationAsync(CancelDeclarationRequest request)
    {
        return (await _client.cancelDeclarationAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<ExportedGoodsResponse> GetInfoOnExportedGoodsAsync(ExportedGoodsRequest request)
    {
        return (await _client.getInfoOnExportedGoodsAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<QueryDeclarationsResponse> QueryDeclarationsAsync(QueryDeclarationsRequest request)
    {
        return (await _client.queryDeclarationsAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<SubmitDeclarationResponse> SubmitDeclarationAsync(SubmitDeclarationRequest request)
    {
        return (await _client.submitDeclarationAsync(request.ToExternalType()))
            .ToInternalType();
    }

    public async Task<SubmitPaymentInfoResponse> SubmitPaymentInfoAsync(SubmitPaymentInfoRequest request)
    {
        return (await _client.submitPaymentInfoAsync(request.ToExternalType()))
            .ToInternalType();
    }

    private static VATRefundforForeignTravelerTRPortClient CreateClient(
        CertificateSerialNumbers certificateSerialNumbers,
        Endpoints endpoints,
        Logging logging
    )
    {
        if (certificateSerialNumbers.StiVatRefund is null || endpoints.StiVatRefund is null)
        {
            throw new InvalidOperationException(
                "STI VAT Refund certificate serial number or endpoint is not configured"
            );
        }

        var client = new VATRefundforForeignTravelerTRPortClient(
            new BasicHttpsBinding(BasicHttpsSecurityMode.Transport)
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

        if (logging.LogSoap == true)
        {
            client.Endpoint.EndpointBehaviors.Add(new MessageLoggingBehavior());
        }

        client.ClientCredentials.ClientCertificate.SetCertificate(
            StoreLocation.LocalMachine,
            StoreName.My,
            X509FindType.FindBySerialNumber,
            certificateSerialNumbers.StiVatRefund
        );

        return client;
    }

    public async ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);
        await _client.CloseAsync();
    }
}