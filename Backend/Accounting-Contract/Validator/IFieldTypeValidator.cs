using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IFieldTypeValidator
{
    /// <summary>
    /// Validate a field value against its field.
    /// </summary>
    /// <param name="field">Field that will have value validated against</param>
    /// <param name="value">Field value</param>
    /// <returns>Validation result for value</returns>
    public Validation ValidateValue(DataTypeField field, object value);

    /// <summary>
    /// Validate a value against a field type. Value must be of certain syntax.
    /// </summary>
    /// <param name="type">Type of the field</param>
    /// <param name="value">Field value</param>
    /// <returns>Validation result for value</returns>
    public Validation ValidateValue(FieldType type, object value);

    /// <summary>
    /// Validate a set of values based on their fields.
    /// </summary>
    /// <param name="fields">Fields</param>
    /// <param name="values">Values to be validated against field type</param>
    /// <returns>Validation result for values</returns>
    public Validation ValidateValues(ICollection<DataTypeField> fields, IDictionary<int, object> values);
}