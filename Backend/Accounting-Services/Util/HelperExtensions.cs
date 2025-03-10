namespace Accounting.Services.Util;

public static class HelperExtensions
{
    /// <summary>
    /// Executes action against object
    /// </summary>
    /// <param name="object">Object to use for action</param>
    /// <param name="action">Action to execute against object</param>
    /// <typeparam name="T">Object type</typeparam>
    /// <returns>Self after executing action</returns>
    public static T Also<T>(this T @object, Action<T> action)
    {
        action(@object);

        return @object;
    }

    /// <summary>
    /// Maps object to another form
    /// </summary>
    /// <param name="object">Object to map</param>
    /// <param name="function">Function to apply</param>
    /// <typeparam name="T">Initial object type</typeparam>
    /// <typeparam name="TResult">Result type</typeparam>
    /// <returns>Result of function</returns>
    public static TResult Let<T, TResult>(this T @object, Func<T, TResult> function)
    {
        return function(@object);
    }
}