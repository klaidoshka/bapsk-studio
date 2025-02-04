using System.Collections.Immutable;
using Account.Services;
using Accounting.Contract.Sti.Data;

namespace Accounting.Services.Sti.Mapping;

public static class Sti
{
    public static IReadOnlyList<StiApiError> ToInternalType(this Errors_TypeError[] errors)
    {
        return errors
            .Select(e => new StiApiError
            {
                Description = e.Description,
                Details = e.Details,
                ErrorCode = e.ErrorCode,
                SequenceNo = e.SequenceNo
            })
            .ToImmutableList();
    }
}