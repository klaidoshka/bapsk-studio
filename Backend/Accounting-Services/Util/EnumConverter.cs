using System.ComponentModel;

namespace Accounting.Services.Util;

public static class EnumConverter
{
    /// <summary>
    /// Converts an enum value to another enum type.
    /// </summary>
    /// <param name="value">current value</param>
    /// <typeparam name="TEnumTo">Enum of another type</typeparam>
    /// <returns>converted enum with same value</returns>
    /// <exception cref="InvalidEnumArgumentException">if target enum has no such value</exception>
    public static TEnumTo ConvertToEnum<TEnumTo>(this Enum value) where TEnumTo : struct, Enum
    {
        if (Enum.TryParse(value.ToString(), true, out TEnumTo target))
        {
            return target;
        }

        throw new InvalidEnumArgumentException($"Unknown enum value: {value}");
    }
}