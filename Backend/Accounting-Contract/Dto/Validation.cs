using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class Validation(IEnumerable<string>? failures, InternalFailure? internalFailure = null)
{
    /// <summary>
    /// Failures that caused validation to fail.
    /// </summary>
    public IEnumerable<string> FailureMessages { get; } = failures ?? [];

    /// <summary>
    /// Code that represents internal failure. Typically, this is null. Only used for specific use-case handling.
    /// </summary>
    public InternalFailure? InternalFailureCode { get; } = internalFailure;

    public Validation() : this([]) { }

    public Validation(string message, InternalFailure? internalFailure = null) : this([message], internalFailure) { }

    public Validation(bool valid, InternalFailure? internalFailure = null) : this(
        valid ? [] : ["Validation failed"],
        internalFailure
    ) { }

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
    public bool IsValid => !FailureMessages.Any() && InternalFailureCode is null;
}