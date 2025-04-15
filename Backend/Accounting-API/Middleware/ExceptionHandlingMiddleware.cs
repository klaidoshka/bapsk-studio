using System.Net;
using System.ServiceModel;
using Accounting.Contract.Dto;

namespace Accounting.API.Middleware;

public class ExceptionHandlingMiddleware : IMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        if (exception is not ValidationException)
        {
            _logger.LogError(exception, "An unexpected error occurred while processing the request");
        }

        var exceptionResponse = exception switch
        {
            ApplicationException => new ExceptionResponse(
                HttpStatusCode.BadRequest,
                "Application exception occurred."
            ),
            ArgumentException => new ExceptionResponse(
                HttpStatusCode.NotFound,
                "The request had invalid arguments."
            ),
            BadHttpRequestException or InvalidOperationException or FaultException => new ExceptionResponse(
                HttpStatusCode.NotAcceptable,
                "The request was not acceptable."
            ),
            KeyNotFoundException => new ExceptionResponse(
                HttpStatusCode.NotFound,
                "The requested resource was not found."
            ),
            UnauthorizedAccessException => new ExceptionResponse(
                HttpStatusCode.Unauthorized,
                "Unauthorized."
            ),
            ValidationException it => new ExceptionResponse(
                HttpStatusCode.BadRequest,
                it.Validation.FailureMessages,
                it.Validation.Codes
            ),
            _ => new ExceptionResponse(
                HttpStatusCode.InternalServerError,
                "Internal server error, please try again later."
            )
        };

        context.Response.StatusCode = exceptionResponse.HttpStatusCode;

        await context.Response.WriteAsJsonAsync(exceptionResponse);
    }
}