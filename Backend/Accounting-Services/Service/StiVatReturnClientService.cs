using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto.StiVatReturn.CancelDeclaration;
using Accounting.Contract.Dto.StiVatReturn.ExportedGoods;
using Accounting.Contract.Dto.StiVatReturn.QueryDeclarations;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;
using Accounting.Contract.Dto.StiVatReturn.SubmitPaymentInfo;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Services.Sti;
using Accounting.Services.Sti.Mapping;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class StiVatReturnClientService : IStiVatReturnClientService, IAsyncDisposable
{
    private readonly VATRefundforForeignTravelerTRPortClient _client;
    private readonly AccountingDatabase _database;

    public StiVatReturnClientService(
        CertificateSerialNumbers certificateSerialNumbers,
        AccountingDatabase database,
        Endpoints endpoints,
        Logging logging
    )
    {
        _database = database;
        _client = CreateClient(certificateSerialNumbers, endpoints, logging);
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
        var declaration = await _database.StiVatReturnDeclarations.FirstOrDefaultAsync(
            d =>
                d.Id == request.Declaration.Header.DocumentId
        );

        if (declaration is not null)
        {
            if (request.Declaration.Header.DocumentCorrectionNo <= declaration.Correction)
            {
                declaration.Correction += 1;
                request.Declaration.Header.DocumentCorrectionNo = declaration.Correction;
            }
            else
            {
                declaration.Correction = request.Declaration.Header.DocumentCorrectionNo;
            }
        }
        else
        {
            await _database.StiVatReturnDeclarations.AddAsync(
                new StiVatReturnDeclaration
                {
                    Id = request.Declaration.Header.DocumentId,
                    Correction = request.Declaration.Header.DocumentCorrectionNo
                }
            );
        }

        await _database.SaveChangesAsync();

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