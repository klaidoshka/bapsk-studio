namespace Accounting.Contract.Response;

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
    /// Asserts that validation result is valid. Throws <see cref="ValidationException"/> if not.
    /// </summary>
    /// <exception cref="ValidationException">Thrown if validation instance is not valid (contains failures)</exception>
    public void AssertValid()
    {
        if (!IsValid)
        {
            throw new ValidationException(this);
        }
    }

    /// <summary>
    /// Checks if validation result is valid.
    /// </summary>
    public bool IsValid => !FailureMessages.Any();
}