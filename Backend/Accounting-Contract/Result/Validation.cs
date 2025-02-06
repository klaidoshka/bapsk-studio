namespace Accounting.Contract.Result;

public class Validation(IEnumerable<string>? failures)
{
    /// <summary>
    /// Failures that caused validation to fail.
    /// </summary>
    public IEnumerable<string> FailureMessages { get; } = failures ?? [];

    public Validation() : this([]) { }
    public Validation(string message) : this([message]) { }
    public Validation(bool valid) : this(valid ? [] : ["Validation failed"]) { }

    /// <summary>
    /// Checks if validation result is valid.
    /// </summary>
    public bool IsValid => !FailureMessages.Any();
}