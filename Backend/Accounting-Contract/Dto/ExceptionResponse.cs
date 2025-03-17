using System.Net;
using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class ExceptionResponse(HttpStatusCode code, IEnumerable<string> messages, InternalFailure? internalFailure = null)
{
    /// <summary>
    /// Code of the failure within the application. Used for specific use-case handling.
    /// Typically, this is null.
    /// </summary>
    public InternalFailure? InternalFailure { get; set; } = internalFailure;

    /// <summary>
    /// Messages to be returned to the client in case of failure.
    /// </summary>
    public IEnumerable<string> Messages { get; set; } = messages;

    /// <summary>
    /// Status code to be returned to the client in case of failure.
    /// </summary>
    public int StatusCode { get; set; } = (int)code;

    public ExceptionResponse(HttpStatusCode code, string message, InternalFailure? internalFailure = null) : this(
        code,
        new List<string> { message },
        internalFailure
    ) { }
}