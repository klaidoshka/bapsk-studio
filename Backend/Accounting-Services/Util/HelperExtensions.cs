namespace Accounting.Services.Util;

public static class HelperExtensions
{
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