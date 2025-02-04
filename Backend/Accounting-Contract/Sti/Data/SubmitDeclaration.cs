namespace Accounting.Contract.Sti.Data;

public class SubmitDeclaration
{
    public Customer Customer { get; set; }
    public DocumentHeader Header { get; set; }
    public Salesman Salesman { get; set; }
    public IReadOnlyList<SalesDocument> SalesDocuments { get; set; }
    public Intermediary Intermediary { get; set; }
}

public class SubmitDeclarationRequest
{
    public SubmitDeclaration Declaration { get; set; }
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public int Situation { get; set; }
}

public class SubmitDeclarationResponse
{
    public SubmitDeclarationState? DeclarationState { get; set; }
    public IReadOnlyList<StiApiError> Errors { get; set; }
    public DateTime ResultDate { get; set; }
    public ResultStatus ResultStatus { get; set; }
    public ulong? TransmissionId { get; set; }
}

public enum SubmitDeclarationState
{
    ACCEPTED_CORRECT,
    ACCEPTED_INCORRECT,
    REJECTED
}

public class Salesman
{
    public string Name { get; set; }
    public LtVatPayerCode VatPayerCode { get; set; }
}

public class LtVatPayerCode
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public string Value { get; set; }
}

public class DocumentHeader
{
    public DocumentHeaderAffirmation Affirmation { get; set; }
    public DateTime CompletionDate { get; set; }
    public string DocumentCorrectionNo { get; set; }
    public string DocumentId { get; set; }
}

public enum DocumentHeaderAffirmation
{
    Y
}

public class Customer
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public PersonIn PersonId { get; set; }
    public DateTime BirthDate { get; set; }
    public IdentityDocument IdentityDocument { get; set; }
    public IReadOnlyList<OtherDocument> OtherDocument { get; set; }
    public NonEuCountryCode? ResidentCountryCode { get; set; }
    public CustomerResTerritory? ResidentTerritory { get; set; }
}

public class PersonIn
{
    public IsoCountryCode IssuedBy { get; set; }
    public string Value { get; set; }
}

public class IdentityDocument
{
    public IdDocNo DocumentNo { get; set; }
    public int DocumentType { get; set; }
}

public class IdDocNo
{
    public IsoCountryCode IssuedBy { get; set; }
    public string Value { get; set; }
}

public class OtherDocument
{
    public OtherDocNo DocumentNo { get; set; }
    public string DocumentType { get; set; }
}

public class OtherDocNo
{
    public IsoCountryCode IssuedBy { get; set; }
    public string Value { get; set; }
}

public class CustomerResTerritory
{
    public string TerritoryCode { get; set; }
    public string TerritoryName { get; set; }
}

public class SalesDocument
{
    public CashRegisterReceipt? CashRegisterReceipt { get; set; }
    public IReadOnlyList<Goods> Goods { get; set; }
    public string? InvoiceNo { get; set; }
    public DateTime SalesDate { get; set; }
}

public class CashRegisterReceipt
{
    public string CashRegisterNo { get; set; }
    public string ReceiptNo { get; set; }
}

public class Goods
{
    public string SequenceNo { get; set; }
    public string Description { get; set; }
    public decimal Quantity { get; set; }
    public string Item { get; set; }
    public ItemChoice ItemElementName { get; set; }
    public decimal TaxableAmount { get; set; }
    public decimal VatRate { get; set; }
    public decimal VatAmount { get; set; }
    public decimal TotalAmount { get; set; }
}

public class Intermediary
{
    public string IntermediaryId { get; set; }
    public string Name { get; set; }
}