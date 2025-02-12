namespace Accounting.Contract.Request;

public class InstanceUserMetaCreateRequest
{
    public int InstanceId { get; set; }
    public int ManagerId { get; set; }
    public int UserId { get; set; }
}