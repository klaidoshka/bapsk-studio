using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class ValidationException(Validation validation) : Exception(
    "Validation failed:\n" + String.Join("\n", validation.FailureMessages)
)
{
    public Validation Validation { get; } = validation;

    public ValidationException(string message, InternalFailure? internalFailure = null) : this(new Validation(message, internalFailure)) { }
    public ValidationException(IEnumerable<string> messages, InternalFailure? internalFailure = null) : this(new Validation(messages, internalFailure)) { }
}