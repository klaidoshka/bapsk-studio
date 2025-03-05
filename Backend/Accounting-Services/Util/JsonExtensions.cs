using System.Text.Json;

namespace Accounting.Services.Util;

public static class JsonExtensions
{
    public static bool IsNull(this JsonElement jsonElement)
    {
        return jsonElement.ValueKind switch
        {
            JsonValueKind.Null or JsonValueKind.Undefined => true,
            _ => false
        };
    }

    public static bool IsNullOrEmpty(this JsonElement jsonElement)
    {
        return jsonElement.ValueKind switch
        {
            JsonValueKind.Null or JsonValueKind.Undefined => true,
            JsonValueKind.String => String.IsNullOrWhiteSpace(jsonElement.GetString()),
            _ => false
        };
    }
}