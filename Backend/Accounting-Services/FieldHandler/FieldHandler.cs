using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public abstract class FieldHandler(FieldType type)
{
    /// <summary>
    /// Type of the field.
    /// </summary>
    public FieldType Type { get; } = type;

    /// <summary>
    /// Deserializes the value from a string.
    /// </summary>
    /// <param name="value">Value to deserialize</param>
    /// <returns>Object deserialized from a string value</returns>
    public abstract object Deserialize(string value);

    /// <summary>
    /// Serializes the value to a string.
    /// </summary>
    /// <param name="value">Value to serialize</param>
    /// <returns>String representing the value that can later be deserialized into value</returns>
    public abstract string Serialize(JsonElement value);

    /// <summary>
    /// Validates the value against the field type.
    /// </summary>
    /// <param name="value">Value to validate</param>
    /// <returns>Validation result</returns>
    public abstract Validation Validate(JsonElement value);
}