using Accounting.Contract.Result;

namespace Accounting.API;

public static class ResultMappings
{
    /// <summary>
    /// Maps a validation result to an API failure.
    /// </summary>
    /// <param name="validation">Validation to map</param>
    /// <returns>Api failure result with mapped failure messages</returns>
    private static ApiFailure ToApiFailure(this Validation validation)
    {
        return new ApiFailure
        {
            Messages = validation.FailureMessages
        };
    }

    /// <summary>
    /// Maps a validation result to an api result of either OK or BadRequest.
    /// </summary>
    /// <param name="validation">Validation to map</param>
    /// <param name="success">Code to execute if it's success</param>
    /// <returns>IResult of either ApiFailure (400) or OK (200)</returns>
    public static async Task<IResult> ToResultAsync(this Validation validation, Func<Task> success)
    {
        if (!validation.IsValid)
        {
            return Results.BadRequest(validation.ToApiFailure());
        }

        await success();

        return Results.Ok();
    }

    /// <summary>
    /// Maps a validation result to an api result of either OK<T> or BadRequest.
    /// </summary>
    /// <param name="validation">Validation to map</param>
    /// <param name="success">Code to execute if it's success</param>
    /// <param name="T">Type of the success result</param>
    /// <returns>IResult of either ApiFailure (400) or OK<T> (200)</returns>
    public static async Task<IResult> ToResultAsync<T>(this Validation validation, Func<Task<T>> success)
    {
        return !validation.IsValid
            ? Results.BadRequest(validation.ToApiFailure())
            : Results.Json(await success());
    }
}