namespace Accounting.Contract.Result;

public class ApiFailure
{
    /// <summary>
    /// Messages to be returned to the client in case of failure.
    /// </summary>
    public IEnumerable<string> Messages { get; init; }
}