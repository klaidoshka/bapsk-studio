using Accounting.Contract;
using Accounting.Contract.Dto.StiVatReturn;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;
using Accounting.Contract.Enumeration;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

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
            request.InstanceId,
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
                    SaleId = request.Sale.Id,
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
            DeclarationState = response.DeclarationState!.Value,
            DocumentId = clientRequest.Declaration.Header.DocumentId,
            ResultDate = response.ResultDate,
            Sale = request.Sale
        };
    }

    private async Task<SubmitDeclarationRequest> ToClientRequest(
        Sale sale,
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
                      de.DataType.Type == DataTypeType.Good &&
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
                    BirthDate = sale.Customer.BirthDate,
                    FirstName = sale.Customer.FirstName,
                    IdentityDocument = new SubmitDeclarationIdentityDocument
                    {
                        DocumentNo = new SubmitDeclarationIdDocumentNo
                        {
                            IssuedBy = sale.Customer.IdentityDocumentIssuedBy,
                            Value = sale.Customer.IdentityDocument
                        },
                        DocumentType = sale.Customer.IdentityDocumentType
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
                        IssuedBy = sale.Salesman.VatPayerCodeIssuedBy,
                        Value = sale.Salesman.VatPayerCode
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

    public Task<IEnumerable<StiVatReturnDeclaration>> GetByCustomerAsync(
        StiVatReturnDeclarationGetByCustomerRequest request
    )
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<StiVatReturnDeclaration>> GetAsync(
        StiVatReturnDeclarationGetRequest request
    )
    {
        throw new NotImplementedException();
    }
}