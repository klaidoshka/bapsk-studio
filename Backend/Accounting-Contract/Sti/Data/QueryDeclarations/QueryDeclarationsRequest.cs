namespace Accounting.Contract.Sti.Data.QueryDeclarations;

/// <summary>
/// Request to query declarations from Sti system that were
/// successfully submitted and match provided Query.
///
/// This should be used when you want to get a list of declarations that
/// within a certain date range have their goods stated as (not)transported.
/// Next you can get the details of the declaration's goods by using
/// ExportedGoodsRequest.
///
/// It can also be used when checking the status of a declaration.
///
/// Only those declarations are returned, that match the provided SenderId.
/// </summary>
public class QueryDeclarationsRequest
{
    /// <summary>
    /// Query for the search.
    /// </summary>
    public required QueryDeclarationsQuery Query { get; set; }

    /// <summary>
    /// Unique identifier for the request, 36 characters.
    /// </summary>
    public required string RequestId { get; set; }

    /// <summary>
    /// Service consumer identification number. It may be
    /// seller or intermediary's identification number.
    ///
    /// 9 characters for individuals,
    /// 10 characters for Sti identification number,
    /// 10 characters for foreigner identification number,
    /// 6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string SenderId { get; set; }

    /// <summary>
    /// When the request was created, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime TimeStamp { get; set; }
}