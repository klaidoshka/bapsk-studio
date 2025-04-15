using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class Validation(ICollection<string>? failures, ICollection<FailureCode>? codes = null)
{
    /// <summary>
    /// Failures that caused validation to fail.
    /// </summary>
    public ICollection<string> FailureMessages { get; } = failures ?? [];

    /// <summary>
    /// Codes that represent internal failures. Typically, this is empty. Only used for specific use-case handling.
    /// </summary>
    public ICollection<FailureCode> Codes { get; } = codes ?? [];

    public Validation() : this([]) { }

    public Validation(string message, ICollection<FailureCode>? codes = null) : this([message], codes) { }

    public Validation(bool valid, ICollection<FailureCode>? codes = null) : this(
        valid ? [] : ["Validation has failed."],
        codes
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
    public bool IsValid => FailureMessages.Count == 0 && Codes.Count == 0;
}