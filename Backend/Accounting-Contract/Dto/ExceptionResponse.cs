using System.Net;
using Accounting.Contract.Configuration;

namespace Accounting.Contract.Dto;

public class ExceptionResponse(HttpStatusCode httpStatusCode, ICollection<string> messages, ICollection<FailureCode> codes)
{
    /// <summary>
    /// Codes of the failures within the application. Used for specific use-case handling.
    /// Typically, this is empty.
    /// </summary>
    public ICollection<FailureCode> Codes { get; set; } = codes;

    /// <summary>
    /// Messages to be returned to the client in case of failure.
    /// </summary>
    public ICollection<string> Messages { get; set; } = messages;

    /// <summary>
    /// Status code to be returned to the client in case of failure.
    /// </summary>
    public int HttpStatusCode { get; set; } = (int)httpStatusCode;

    public ExceptionResponse(HttpStatusCode httpStatusCode, string message, ICollection<FailureCode>? codes = null) : this(
        httpStatusCode,
        new HashSet<string> { message },
        codes ?? []
    ) { }
}