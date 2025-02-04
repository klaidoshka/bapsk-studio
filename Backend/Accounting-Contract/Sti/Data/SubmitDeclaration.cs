namespace Accounting.Contract.Sti.Data;

public class SubmitDeclaration
{
    public required Customer Customer { get; set; }
    public required DocumentHeader Header { get; set; }
    public required Salesman Salesman { get; set; }
    public required IReadOnlyList<SalesDocument> SalesDocuments { get; set; }
    public required Intermediary Intermediary { get; set; }
}

public class SubmitDeclarationRequest
{
    public required SubmitDeclaration Declaration { get; set; }
    public required string RequestId { get; set; }
    public required DateTime TimeStamp { get; set; }
    public required string SenderIn { get; set; }
    public required int Situation { get; set; }
}

public class SubmitDeclarationResponse
{
    public required SubmitDeclarationState DeclarationState { get; set; }
    public required bool DeclarationStateSpecified { get; set; }
    public required IReadOnlyList<StiApiError> Errors { get; set; }
    public required DateTime ResultDate { get; set; }
    public required ResultStatus ResultStatus { get; set; }
    public required ulong TransmissionId { get; set; }
    public required bool TransmissionIdSpecified { get; set; }
}

public enum SubmitDeclarationState
{
    ACCEPTED_CORRECT,
    ACCEPTED_INCORRECT,
    REJECTED
}

public class Salesman
{
    public required string Name { get; set; }
    public required LtVatPayerCode VatPayerCode { get; set; }
}

public class LtVatPayerCode
{
    public required IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public required string Value { get; set; }
}

public class DocumentHeader
{
    public required DocumentHeaderAffirmation Affirmation { get; set; }
    public required DateTime CompletionDate { get; set; }
    public required string DocumentCorrectionNo { get; set; }
    public required string DocumentId { get; set; }
}

public enum DocumentHeaderAffirmation
{
    Y
}

public class Customer
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required PersonIn PersonId { get; set; }
    public required DateTime BirthDate { get; set; }
    public required IdentityDocument IdentityDocument { get; set; }
    public required IReadOnlyList<OtherDocument> OtherDocument { get; set; }
    public required NonEuCountryCode? ResidentCountryCode { get; set; }
    public required CustomerResTerritory? ResidentTerritory { get; set; }
}

public class PersonIn
{
    public required IsoCountryCode IssuedBy { get; set; }
    public required string Value { get; set; }
}

public class IdentityDocument
{
    public required IdDocNo DocumentNo { get; set; }
    public required int DocumentType { get; set; }
}

public class IdDocNo
{
    public required IsoCountryCode IssuedBy { get; set; }
    public required string Value { get; set; }
}

public class OtherDocument
{
    public required OtherDocNo DocumentNo { get; set; }
    public required string DocumentType { get; set; }
}

public class OtherDocNo
{
    public required IsoCountryCode IssuedBy { get; set; }
    public required string Value { get; set; }
}

public class CustomerResTerritory
{
    public required string TerritoryCode { get; set; }
    public required string TerritoryName { get; set; }
}

public class SalesDocument
{
    public required CashRegisterReceipt? CashRegisterReceipt { get; set; }
    public required IReadOnlyList<Goods> Goods { get; set; }
    public required string? InvoiceNo { get; set; }
    public required DateTime SalesDate { get; set; }
}

public class CashRegisterReceipt
{
    public required string CashRegisterNo { get; set; }
    public required string ReceiptNo { get; set; }
}

public class Goods
{
    public required string SequenceNo { get; set; }
    public required string Description { get; set; }
    public required decimal Quantity { get; set; }
    public required string Item { get; set; }
    public required ItemChoice ItemElementName { get; set; }
    public required decimal TaxableAmount { get; set; }
    public required decimal VatRate { get; set; }
    public required decimal VatAmount { get; set; }
    public required decimal TotalAmount { get; set; }
}

public class Intermediary
{
    public required string IntermediaryId { get; set; }
    public required string Name { get; set; }
}