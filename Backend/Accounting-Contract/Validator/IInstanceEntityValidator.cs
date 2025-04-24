namespace Accounting.Contract.Validator;

public interface IInstanceEntityValidator<T> where T : class
{
    public Task<bool> IsFromInstanceAsync(int id, int instanceId);
}