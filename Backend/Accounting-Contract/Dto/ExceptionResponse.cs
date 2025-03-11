using System.Net;

namespace Accounting.Contract.Dto;

public class ExceptionResponse(HttpStatusCode code, IEnumerable<string> messages)
{
    /// <summary>
    /// Messages to be returned to the client in case of failure.
    /// </summary>
    public IEnumerable<string> Messages { get; set; } = messages;

    /// <summary>
    /// Status code to be returned to the client in case of failure.
    /// </summary>
    public int StatusCode { get; set; } = (int)code;

    public ExceptionResponse(HttpStatusCode code, string message) : this(
        code,
        new List<string> { message }
    ) { }
}