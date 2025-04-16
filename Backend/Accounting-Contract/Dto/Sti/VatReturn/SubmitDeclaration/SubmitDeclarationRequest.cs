using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationRequest
{
    public required SubmitDeclaration Declaration { get; set; }
    public required string RequestId { get; set; }
    public required string SenderId { get; set; }
    public required int Situation { get; set; }
    public required DateTime TimeStamp { get; set; }
}

public static class SubmitDeclarationRequestExtensions
{
    public static SubmitDeclarationRequest ToSubmitDeclarationRequest(
        this Entity.StiVatReturnDeclaration declaration,
        NonEuCountryCode customerResidenceCountry,
        string requestId,
        StiVatReturn vatReturnConfiguration,
        DateTime date,
        TimeZoneInfo timeZone
    )
    {
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
                        Quantity = it.Quantity,
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
                    CompletionDate = date.Date,
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
            TimeStamp = date
        };
    }
}