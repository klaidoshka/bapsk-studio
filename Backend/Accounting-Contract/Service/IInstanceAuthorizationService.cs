namespace Accounting.Contract.Service;

public interface IInstanceAuthorizationService
{
    public Task<bool> IsAuthorizedAsync(int instanceId, int userId, string permission);
    
    public Task<bool> IsCreatorAsync(int instanceId, int userId);

    public Task<bool> IsMemberAsync(int instanceId, int userId);
}