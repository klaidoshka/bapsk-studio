namespace Accounting.Contract.Request;

public class DataTypeEditRequest
{
    public string? Description { get; set; }
    public int Id { get; set; }
    public int ManagerId { get; set; }
    public string Name { get; set; }
}