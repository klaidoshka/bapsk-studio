using Accounting.Contract;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;
using Accounting.Contract.Request.StiVatReturn;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using StiVatReturnDeclaration = Accounting.Contract.Dto.StiVatReturn.StiVatReturnDeclaration;

namespace Accounting.Services.Service;

public class VatReturnService : IVatReturnService
{
    private readonly AccountingDatabase _database;
    private readonly IStiVatReturnClientService _stiVatReturnClientService;
    private readonly IVatReturnValidator _validator;

    public VatReturnService(
        AccountingDatabase database,
        IStiVatReturnClientService stiVatReturnClientService,
        IVatReturnValidator validator
    )
    {
        _database = database;
        _stiVatReturnClientService = stiVatReturnClientService;
        _validator = validator;
    }

    // If IDS are missing, means sent a whole instance, otherwise get the specific data.
    // Upon submission create data that was missing and return ids together with the declaration response.
    // For easier management, if id is set, resolve instance, apply its data onto the request body.
    public async Task<StiVatReturnDeclaration> SubmitAsync(
        StiVatReturnDeclarationSubmitRequest request
    )
    {
        (await _validator.ValidateSubmitRequestAsync(request)).AssertValid();

        var declaration = await _database.StiVatReturnDeclarations.FirstOrDefaultAsync(
            d => d.SaleId == request.Sale.Id
        );

        if (declaration != null)
        {
            declaration.Correction += 1;
        }

        var clientRequest = await ToClientRequest(
            request.Sale,
            request.InstanceId ?? -1, // TODO: Handle correctly
            declaration?.Correction ?? 1
        );

        var response = await _stiVatReturnClientService.SubmitDeclarationAsync(clientRequest);

        if (response.DeclarationState == null)
        {
            throw new ValidationException(
                new Validation(
                    response.Errors
                        .Select(e => e.Details)
                        .ToList()
                )
            );
        }

        if (declaration == null)
        {
            await _database.StiVatReturnDeclarations.AddAsync(
                new Contract.Entity.StiVatReturnDeclaration
                {
                    Correction = 1,
                    DeclaredById = request.RequesterId,
                    Id = clientRequest.Declaration.Header.DocumentId,
                    InstanceId = request.InstanceId,
                    State = response.DeclarationState,
                    SubmitDate = response.ResultDate
                }
            );
        }
        else
        {
            declaration.State = response.DeclarationState;
            declaration.SubmitDate = response.ResultDate;
        }

        await _database.SaveChangesAsync();

        return new StiVatReturnDeclaration
        {
            State = response.DeclarationState!.Value,
            DocumentId = clientRequest.Declaration.Header.DocumentId,
            Date = response.ResultDate,
            SaleId = request.Sale.Id ?? -1 // TODO: Get from database
        };
    }

    private async Task<SubmitDeclarationRequest> ToClientRequest(
        StiVatReturnDeclarationSubmitRequestSale sale,
        int instanceId,
        int correctionNo
    )
    {
        var requestId = $"{Guid.NewGuid():N}";
        var documentId = $"{Guid.NewGuid():N}";
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);

        var goods = await _database.DataEntries
            .Include(de => de.DataType)
            .Where(
                de => de.DataType.InstanceId == instanceId &&
                      // de.DataType.Type == DataTypeType.Good &&
                      de.DataType.Fields.Any(f => f.ReferenceId == sale.Id)
            )
            .ToListAsync();

        // TODO: Map goods to sales document

        return new SubmitDeclarationRequest
        {
            Declaration = new SubmitDeclaration
            {
                Customer = new SubmitDeclarationCustomer
                {
                    BirthDate = sale.Customer.Birthdate,
                    FirstName = sale.Customer.FirstName,
                    IdentityDocument = new SubmitDeclarationIdentityDocument
                    {
                        DocumentNo = new SubmitDeclarationIdDocumentNo
                        {
                            IssuedBy = sale.Customer.IdentityDocument.IssuedBy,
                            Value = sale.Customer.IdentityDocument.Value
                        },
                        DocumentType = sale.Customer.IdentityDocument.Type
                    },
                    LastName = sale.Customer.LastName
                },
                Header = new SubmitDeclarationDocumentHeader
                {
                    Affirmation = SubmitDeclarationDocumentHeaderAffirmation.Y,
                    CompletionDate = now,
                    DocumentCorrectionNo = 1,
                    DocumentId = documentId
                },
                Intermediary = new SubmitDeclarationIntermediary
                {
                    IntermediaryId = "123456789", // TODO: Get from configuration
                    Name = "Accounting Services Tool" // TODO: Get from configuration
                },
                Salesman = new SubmitDeclarationSalesman
                {
                    Name = sale.Salesman.Name,
                    VatPayerCode = new SubmitDeclarationLtVatPayerCode
                    {
                        IssuedBy = sale.Salesman.VatPayerCode.IssuedBy,
                        Value = sale.Salesman.VatPayerCode.Value
                    }
                },
                SalesDocuments = [] // TODO: Map sales documents
            },
            RequestId = requestId,
            SenderId = "123456789", // TODO: Get from configuration
            Situation = 1,
            TimeStamp = now
        };
    }
}