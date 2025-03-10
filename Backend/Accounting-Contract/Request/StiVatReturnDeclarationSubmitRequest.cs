using Accounting.Contract.Dto.StiVatReturn;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Request;

public class StiVatReturnDeclarationSubmitRequest
{
    public bool Affirmation { get; set; }
    public int? InstanceId { get; set; }
    public int? RequesterId { get; set; }
    public StiVatReturnDeclarationSubmitRequestSale Sale { get; set; }
}

public class StiVatReturnDeclarationSubmitRequestSale
{
    public StiVatReturnDeclarationSubmitRequestCashRegister? CashRegister { get; set; }
    public StiVatReturnDeclarationSubmitRequestCustomer Customer { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int? Id { get; set; }
    public int? InstanceId { get; set; }
    public string? InvoiceNo { get; set; }
    public StiVatReturnDeclarationSubmitRequestSalesman Salesman { get; set; } = new();

    public IEnumerable<StiVatReturnDeclarationSubmitRequestSoldGood> SoldGoods { get; set; } =
        new List<StiVatReturnDeclarationSubmitRequestSoldGood>();
}

public class StiVatReturnDeclarationSubmitRequestCashRegister
{
    public string CashRegisterNo { get; set; } = String.Empty;
    public string ReceiptNo { get; set; } = String.Empty;
}

public class StiVatReturnDeclarationSubmitRequestCustomer
{
    public DateTime Birthdate { get; set; } = DateTime.UtcNow;
    public string FirstName { get; set; } = String.Empty;
    public int? Id { get; set; }

    public StiVatReturnDeclarationSubmitRequestCustomerIdentityDocument IdentityDocument
    {
        get;
        set;
    } = new();

    public string LastName { get; set; } = String.Empty;
}

public class StiVatReturnDeclarationSubmitRequestCustomerIdentityDocument
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public IdentityDocumentType Type { get; set; } = IdentityDocumentType.Passport;
    public string Value { get; set; } = String.Empty;
}

public class StiVatReturnDeclarationSubmitRequestSalesman
{
    public int? Id { get; set; }
    public string Name { get; set; } = String.Empty;

    public StiVatReturnDeclarationSubmitRequestSalesmanVatPayerCode VatPayerCode { get; set; } =
        new();
}

public class StiVatReturnDeclarationSubmitRequestSalesmanVatPayerCode
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public string Value { get; set; } = String.Empty;
}

public class StiVatReturnDeclarationSubmitRequestSoldGood
{
    public string Description { get; set; }
    public int? Id { get; set; }
    public int Quantity { get; set; }
    public string SequenceNo { get; set; }
    public decimal TaxableAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string UnitOfMeasure { get; set; }
    public UnitOfMeasureType UnitOfMeasureType { get; set; }
    public decimal VatAmount { get; set; }
    public decimal VatRate { get; set; }
}