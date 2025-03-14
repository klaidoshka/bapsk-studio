using System.Runtime.Serialization;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.Xml;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
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
        try
        {
            return (await _client.submitDeclarationAsync(request.ToExternalType()))
                .ToInternalType();
        }
        catch (FaultException<object> faultEx)
        {
            var fault = faultEx.CreateMessageFault();

            if (!fault.HasDetail)
            {
                throw;
            }

            using var reader = fault.GetReaderAtDetailContents();
            var errors = new List<string>();
            
            while (reader.Read())
            {
                if (reader.NodeType == XmlNodeType.Element && reader.LocalName == "ValidationError")
                {
                    errors.Add(reader.ReadElementContentAsString());
                }
            }

            throw new ValidationException(errors);
        }
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

[DataContract(Namespace = "http://springframework.org/spring-ws")]
public class ValidationError
{
    [DataMember]
    public string Value { get; set; }
}