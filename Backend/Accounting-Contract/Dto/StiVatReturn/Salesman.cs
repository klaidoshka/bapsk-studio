using Accounting.Contract.Entity;
using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class Salesman
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string VatPayerCode { get; set; }

    public IsoCountryCode VatPayerCodeIssuedBy { get; set; } = IsoCountryCode.LT;

    public static Entity.DataType DataType =>
        new()
        {
            Name = "Salesman",
            Description = "Person that sold goods to the customer",
            Fields = new List<Entity.DataTypeField>(3)
            {
                new()
                {
                    Name = "Name",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "VAT Payer Code",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "VAT Payer Code Issued By",
                    Type = FieldType.IsoCountryCode,
                    IsRequired = true
                }
            },
            Type = DataTypeType.Salesman
        };
}