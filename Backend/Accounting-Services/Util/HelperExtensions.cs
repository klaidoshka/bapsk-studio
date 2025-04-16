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

    public static string Squash(this string text)
    {
        return text
            .ReplaceLineEndings(String.Empty)
            .Replace("\t", String.Empty);
    }
}