namespace Accounting.Services.Util;

public static class DateUtil
{
    public static DateTime GetVilniusDateTime()
    {
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, GetVilniusTimeZone());

        return DateTime.Parse(now.ToString("yyyy-MM-ddTHH:mm:ss"));
    }

    public static TimeZoneInfo GetVilniusTimeZone() => TimeZoneInfo.FindSystemTimeZoneById("Europe/Vilnius");

    public static DateTime StripMilliseconds(DateTime date)
    {
        return DateTime.Parse(date.ToString("yyyy-MM-ddTHH:mm:ss"));
    }
}