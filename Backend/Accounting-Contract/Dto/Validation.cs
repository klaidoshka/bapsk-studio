using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class Validation(ICollection<string>? failures, ICollection<FailureCode>? codes = null)
{
    public ICollection<string> FailureMessages { get; } = failures ?? [];
    public ICollection<FailureCode> Codes { get; } = codes ?? [];

    public Validation() : this([]) { }

    public Validation(string message, ICollection<FailureCode>? codes = null) : this([message], codes) { }

    public Validation(bool valid, ICollection<FailureCode>? codes = null) : this(
        valid ? [] : ["Validation has failed."],
        codes
    ) { }

    public Validation AssertValid()
    {
        if (!IsValid)
        {
            throw new ValidationException(this);
        }

        return this;
    }

    public bool IsValid => FailureMessages.Count == 0 && Codes.Count == 0;
}

public class Validation<T> : Validation
{
    private readonly T? _value;

    public T Value
    {
        get
        {
            if (!IsValid)
            {
                throw new ValidationException(this);
            }

            return _value ?? throw new InvalidOperationException("Validation result value is null.");
        }
        init => _value = value;
    }

    public Validation(T value) : base([])
    {
        _value = value;
    }

    public Validation(ICollection<string>? failures = null, ICollection<FailureCode>? codes = null) : base(
        failures,
        codes
    ) { }

    public Validation(string message, ICollection<FailureCode>? codes = null) : base(message, codes) { }
    
    public new Validation<T> AssertValid()
    {
        if (!IsValid)
        {
            throw new ValidationException(this);
        }

        return this;
    }
}