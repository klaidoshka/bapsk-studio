using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Customer;

public class CustomerOtherDocument
{
    public int Id { get; set; }
    public IsoCountryCode IssuedBy { get; set; }
    public string Type { get; set; } = String.Empty;
    public string Value { get; set; } = String.Empty;
}

public static class CustomerOtherDocumentExtensions
{
    public static CustomerOtherDocument ToDto(this Entity.CustomerOtherDocument document)
    {
        return new()
        {
            Id = document.Id,
            IssuedBy = document.IssuedBy,
            Type = document.Type,
            Value = document.Value
        };
    }
    
    public static Entity.CustomerOtherDocument ToEntity(this CustomerOtherDocument document)
    {
        return new()
        {
            Id = document.Id,
            IssuedBy = document.IssuedBy,
            Type = document.Type,
            Value = document.Value
        };
    }
}