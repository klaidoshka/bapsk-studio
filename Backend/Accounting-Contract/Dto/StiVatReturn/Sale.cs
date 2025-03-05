using Accounting.Contract.Entity;
using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Dto.StiVatReturn;

// InvoiceNo or CashRegisterReceiptNo and CashRegisterNo must be provided
public class Sale
{
    public Customer Customer { get; set; }

    public string? CashRegisterNo { get; set; }

    public string? CashRegisterReceiptNo { get; set; }

    public int Id { get; set; }

    public string? InvoiceNo { get; set; }

    public Salesman Salesman { get; set; }

    public DateTime SalesDate { get; set; }

    public static Entity.DataType DataType =>
        new()
        {
            Name = "Sale",
            Description = "Occurred sale of goods made by salesman for customer",
            Fields = new List<Entity.DataTypeField>
            {
                new()
                {
                    Name = "Customer",
                    Type = FieldType.Reference,
                    IsRequired = true
                },
                new()
                {
                    Name = "Salesman",
                    Type = FieldType.Reference,
                    IsRequired = true
                },
                new()
                {
                    Name = "Date",
                    Type = FieldType.Date,
                    IsRequired = true
                },
                new()
                {
                    Name = "Cash Register No",
                    Type = FieldType.Text
                },
                new()
                {
                    Name = "Cash Register Receipt No",
                    Type = FieldType.Text
                },
                new()
                {
                    Name = "Invoice No",
                    Type = FieldType.Text
                }
            },
            Type = DataTypeType.Sale
        };
}