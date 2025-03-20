using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

/// <summary>
///     Request to submit or correct a tax-free declaration.
///     If providing a correction, the original declaration number must be provided.
///     However, correction number must also be provided, it must be higher than the
///     previous one.
///     Only accepted declarations can be corrected. If the declaration was submitted
///     for tax refund, then the same declaration cannot be corrected.
/// </summary>
public class SubmitDeclarationRequest
{
    /// <summary>
    ///     TaxFree declaration information
    /// </summary>
    public required SubmitDeclaration Declaration { get; set; }

    /// <summary>
    ///     Unique identifier for the request, 40 characters.
    /// </summary>
    public required string RequestId { get; set; }

    /// <summary>
    ///     Service consumer identification number. It may be
    ///     seller or intermediary's identification number.
    ///     9 characters for individuals,
    ///     10 characters for Sti identification number,
    ///     10 characters for foreigner identification number,
    ///     6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string SenderId { get; set; }

    /// <summary>
    ///     Length of 1 digit:
    ///     1 - When instant declaration is requested by the salesman.
    ///     2 - When deferred declaration is requested by the salesman,
    ///     since the buyer has been given a paper declaration.
    /// </summary>
    public required int Situation { get; set; }

    /// <summary>
    ///     When the request was created, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime TimeStamp { get; set; }
}

public static class SubmitDeclarationRequestExtensions
{
    public static SubmitDeclarationRequest ToSubmitDeclarationRequest(
        this Entity.StiVatReturnDeclaration declaration,
        NonEuCountryCode customerResidenceCountry,
        string requestId,
        StiVatReturn vatReturnConfiguration
    )
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);
        var nowNoMillis = DateTime.Parse(now.ToString("yyyy-MM-ddTHH:mm:ss"));

        var customerIdentityDocument = new SubmitDeclarationIdentityDocument
        {
            DocumentNo = new()
            {
                IssuedBy = declaration.Sale.Customer.IdentityDocumentIssuedBy,
                Value = declaration.Sale.Customer.IdentityDocumentNumber
            },
            DocumentType = declaration.Sale.Customer.IdentityDocumentType
        };

        var customerPersonalCode = declaration.Sale.Customer.IdentityDocumentValue is not null
            ? new SubmitDeclarationPersonId
            {
                IssuedBy = declaration.Sale.Customer.IdentityDocumentIssuedBy,
                Value = declaration.Sale.Customer.IdentityDocumentValue
            }
            : null;

        var customerOtherDocuments = declaration.Sale.Customer.OtherDocuments
            .Select(
                it => new SubmitDeclarationOtherDocument
                {
                    DocumentNo = new SubmitDeclarationOtherDocumentNo
                    {
                        IssuedBy = it.IssuedBy,
                        Value = it.Value
                    },
                    DocumentType = it.Type
                }
            )
            .ToList();

        var customer = new SubmitDeclarationCustomer
        {
            BirthDate = TimeZoneInfo.ConvertTimeFromUtc(declaration.Sale.Customer.Birthdate.Date, timeZone),
            FirstName = declaration.Sale.Customer.FirstName,
            IdentityDocument = customerIdentityDocument,
            LastName = declaration.Sale.Customer.LastName,
            OtherDocuments = customerOtherDocuments,
            PersonId = customerPersonalCode,
            ResidentCountryCode = customerResidenceCountry
        };

        var salesman = new SubmitDeclarationSalesman
        {
            Name = declaration.Sale.Salesman.Name,
            VatPayerCode = new SubmitDeclarationLtVatPayerCode
            {
                IssuedBy = declaration.Sale.Salesman.VatPayerCodeIssuedBy,
                Value = declaration.Sale.Salesman.VatPayerCode
            }
        };

        var sale = new SubmitDeclarationSalesDocument
        {
            CashRegisterReceipt = String.IsNullOrWhiteSpace(declaration.Sale.InvoiceNo)
                ? new SubmitDeclarationCashRegisterReceipt
                {
                    CashRegisterNo = declaration.Sale.CashRegisterNo!,
                    ReceiptNo = declaration.Sale.CashRegisterReceiptNo!,
                }
                : null,
            Goods = declaration.Sale.SoldGoods
                .Select(
                    it => new SubmitDeclarationGoods
                    {
                        Description = it.Description,
                        Quantity = Math.Truncate(it.Quantity),
                        SequenceNo = it.SequenceNo,
                        TaxableAmount = Math.Round(it.TaxableAmount, 2),
                        TotalAmount = Math.Round(it.TotalAmount, 2),
                        UnitOfMeasure = it.UnitOfMeasure,
                        UnitOfMeasureType = it.UnitOfMeasureType,
                        VatAmount = Math.Round(it.VatAmount, 2),
                        VatRate = Math.Round(it.VatRate, 2)
                    }
                )
                .ToList(),
            InvoiceNo = String.IsNullOrWhiteSpace(declaration.Sale.InvoiceNo)
                ? null
                : declaration.Sale.InvoiceNo,
            SalesDate = TimeZoneInfo.ConvertTimeFromUtc(declaration.Sale.Date.Date, timeZone)
        };

        return new()
        {
            Declaration = new SubmitDeclaration
            {
                Customer = customer,
                Header = new SubmitDeclarationDocumentHeader
                {
                    Affirmation = SubmitDeclarationDocumentHeaderAffirmation.Y,
                    CompletionDate = now.Date,
                    DocumentCorrectionNo = declaration.Correction,
                    DocumentId = declaration.Id
                },
                Intermediary = new SubmitDeclarationIntermediary
                {
                    Id = vatReturnConfiguration.Sender.Id,
                    Name = vatReturnConfiguration.Sender.Name
                },
                Salesman = salesman,
                SalesDocuments = [sale]
            },
            RequestId = requestId,
            SenderId = vatReturnConfiguration.Sender.Id,
            Situation = 1,
            TimeStamp = nowNoMillis
        };
    }
}