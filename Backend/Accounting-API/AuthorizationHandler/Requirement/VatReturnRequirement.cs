using Microsoft.AspNetCore.Authorization;

namespace Accounting.API.AuthorizationHandler.Requirement;

public class VatReturnRequirement(VatReturnRequirement.CrudOperation operation) : IAuthorizationRequirement
{
    public CrudOperation Operation { get; } = operation;

    public enum CrudOperation
    {
        Cancel,
        Create,
        GetBySaleId,
        SubmitPayment,
        UpdateInfo
    }
}