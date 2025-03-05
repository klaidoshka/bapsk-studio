using Accounting.Contract.Entity;
using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class Customer
{
    public DateTime BirthDate { get; set; }

    public string FirstName { get; set; }

    public int Id { get; set; }

    public string IdentityDocument { get; set; }

    public IsoCountryCode IdentityDocumentIssuedBy { get; set; }

    public IdentityDocumentType IdentityDocumentType { get; set; }

    public string LastName { get; set; }

    public static Entity.DataType DataType =>
        new()
        {
            Name = "Customer",
            Description = "Customer's main information",
            Fields = new List<Entity.DataTypeField>(6)
            {
                new()
                {
                    Name = "Birthdate",
                    Type = FieldType.Date,
                    IsRequired = true
                },
                new()
                {
                    Name = "First Name",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "Identity Document",
                    Type = FieldType.Text,
                    IsRequired = true
                },
                new()
                {
                    Name = "ID Issued By",
                    Type = FieldType.IsoCountryCode,
                    IsRequired = true
                },
                new()
                {
                    Name = "ID Type",
                    Type = FieldType.IdentityDocumentType,
                    IsRequired = true
                },
                new()
                {
                    Name = "Last Name",
                    Type = FieldType.Text,
                    IsRequired = true
                }
            },
            Type = DataTypeType.Customer
        };
}