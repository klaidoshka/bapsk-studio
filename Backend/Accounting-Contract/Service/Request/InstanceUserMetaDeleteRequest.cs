namespace Accounting.Contract.Service.Request;

public class InstanceUserMetaDeleteRequest
{
    public int InstanceId { get; set; }
    public int ManagerId { get; set; }
    public int UserId { get; set; }
}