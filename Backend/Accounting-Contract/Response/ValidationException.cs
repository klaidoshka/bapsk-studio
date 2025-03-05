namespace Accounting.Contract.Response;

public class ValidationException(Validation validation) : Exception(
    "Validation failed:\n" + String.Join("\n", validation.FailureMessages)
)
{
    public Validation Validation { get; } = validation;

    public ValidationException(string message) : this(new Validation(message)) { }
}