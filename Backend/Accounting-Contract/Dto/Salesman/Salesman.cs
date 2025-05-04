namespace Accounting.Contract.Dto.Salesman;

public class Salesman
{
    public int? Id { get; set; }
    public int? InstanceId { get; set; }
    public string Name { get; set; } = String.Empty;
    public SalesmanVatPayerCode VatPayerCode { get; set; } = new();
}

public static class SalesmanExtensions
{
    public static Salesman ToDto(this Entity.Salesman salesman)
    {
        return new Salesman
        {
            Id = salesman.Id,
            InstanceId = salesman.InstanceId,
            Name = salesman.Name,
            VatPayerCode = new SalesmanVatPayerCode
            {
                IssuedBy = salesman.VatPayerCodeIssuedBy,
                Value = salesman.VatPayerCode
            }
        };
    }

    public static Entity.Salesman ToEntity(this Salesman salesman)
    {
        return new Entity.Salesman
        {
            Id = salesman.Id ?? 0,
            Name = salesman.Name,
            VatPayerCode = salesman.VatPayerCode.Value,
            VatPayerCodeIssuedBy = salesman.VatPayerCode.IssuedBy
        };
    }
}