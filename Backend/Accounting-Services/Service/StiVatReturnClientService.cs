using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Accounting.Contract.Service;
using Accounting.Services.Sti;
using Accounting.Services.Sti.Mapping;

namespace Accounting.Services.Service;

public class StiVatReturnClientService : IStiVatReturnClientService, IAsyncDisposable
{
    private readonly VATRefundforForeignTravelerTRPortClient _client;

    public StiVatReturnClientService(
        StiVatReturn stiVatReturn,
        Logging logging
    )
    {
        _client = CreateClient(stiVatReturn, logging);
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

    public async Task<SubmitDeclarationResponse> SubmitDeclarationAsync(
        SubmitDeclarationRequest request
    )
    {
        return (await _client.submitDeclarationAsync(request.ToExternalType()))
            .ToInternalType();
    }

    private static VATRefundforForeignTravelerTRPortClient CreateClient(
        StiVatReturn stiVatReturn,
        Logging logging
    )
    {
        if (stiVatReturn.CertificateSerialNumber is null || stiVatReturn.Endpoint is null)
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
            new EndpointAddress(stiVatReturn.Endpoint)
        );

        if (logging.LogSoap == true)
        {
            client.Endpoint.EndpointBehaviors.Add(new MessageLoggingBehavior());
        }

        client.ClientCredentials.ClientCertificate.SetCertificate(
            StoreLocation.LocalMachine,
            StoreName.My,
            X509FindType.FindBySerialNumber,
            stiVatReturn.CertificateSerialNumber
        );

        return client;
    }

    public async ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);
        await _client.CloseAsync();
    }
}