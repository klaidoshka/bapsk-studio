using Accounting.Contract.Dto.StiVatReturn;

namespace Accounting.Contract.Request;

public class StiVatReturnDeclarationSubmitRequest
{
    public bool Affirmation { get; set; }
    public int InstanceId { get; set; }
    public int RequesterId { get; set; }
    public Sale Sale { get; set; }
}