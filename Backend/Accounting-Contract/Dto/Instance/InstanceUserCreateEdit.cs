namespace Accounting.Contract.Dto.Instance;

public class InstanceUserCreateEdit
{
    public IList<string> Permissions { get; set; }
    public int UserId { get; set; }
}