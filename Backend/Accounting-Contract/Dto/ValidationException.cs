using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class ValidationException(Validation validation) : Exception(
    "Validation failed:\n" + String.Join("\n", validation.FailureMessages)
)
{
    public Validation Validation { get; } = validation;

    public ValidationException(string message, ICollection<FailureCode>? codes = null) : this(new Validation(message, codes)) { }
    public ValidationException(ICollection<string> messages, ICollection<FailureCode>? codes = null) : this(new Validation(messages, codes)) { }
}