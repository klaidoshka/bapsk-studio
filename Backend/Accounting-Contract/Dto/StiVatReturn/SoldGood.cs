using Accounting.Contract.Entity;
using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class SoldGood
{
    public string Description { get; set; }

    public int Id { get; set; }

    public int Quantity { get; set; }

    public Sale Sale { get; set; }

    public string SequenceNo { get; set; }

    public decimal TaxableAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public string UnitOfMeasure { get; set; }

    public UnitOfMeasureType UnitOfMeasureType { get; set; }

    public decimal VatAmount { get; set; }

    public decimal VatRate { get; set; }

    public static Entity.DataType DataType =>
        new()
        {
            Name = "Sold Good",
            Description = "Goods that were sold to the customer",
            Fields = new List<Entity.DataTypeField>(10)
            {
                new()
                {
                    Name = "Description",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "Unit of Measure",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "Unit of Measure Type",
                    Type = FieldType.UnitOfMeasureType,
                    IsRequired = true
                },
                new()
                {
                    Name = "Quantity",
                    Type = FieldType.Number,
                    IsRequired = true
                },
                new()
                {
                    Name = "Sale",
                    Type = FieldType.Reference,
                    IsRequired = true
                },
                new()
                {
                    Name = "Sequence No",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "Taxable Amount",
                    Type = FieldType.Number,
                    IsRequired = true
                },
                new()
                {
                    Name = "Total Amount",
                    Type = FieldType.Number,
                    IsRequired = true
                },
                new()
                {
                    Name = "VAT Amount",
                    Type = FieldType.Number,
                    IsRequired = true
                },
                new()
                {
                    Name = "VAT Rate",
                    Type = FieldType.Number,
                    IsRequired = true
                }
            },
            Type = DataTypeType.Good
        };
}