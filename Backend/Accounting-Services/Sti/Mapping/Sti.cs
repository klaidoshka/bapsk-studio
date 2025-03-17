using System.Collections.Immutable;
using Accounting.Contract.Dto.Sti;

namespace Accounting.Services.Sti.Mapping;

public static class Sti
{
    public static IReadOnlyList<StiError> ToInternalType(this Errors_TypeError[] errors)
    {
        return errors
            .Select(
                e => new StiError
                {
                    Description = e.Description,
                    Details = e.Details,
                    ErrorCode = e.ErrorCode,
                    SequenceNo = e.SequenceNo
                }
            )
            .ToImmutableList();
    }
}