using System.Collections.Immutable;
using Accounting.Contract.Sti;
using Accounting.Contract.Sti.QueryDeclarations;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class QueryDeclaration
{
    public static queryDeclarationsRequest ToExternalType(this QueryDeclarationsRequest request)
    {
        return new queryDeclarationsRequest
        {
            Query = request.Query.ToExternalType(),
            RequestId = request.RequestId,
            SenderIn = request.SenderId,
            TimeStamp = request.TimeStamp
        };
    }

    private static queryDeclarationsRequestQuery ToExternalType(this QueryDeclarationsQuery query)
    {
        var queryNew = new queryDeclarationsRequestQuery
        {
            DeclState = query.DeclarationState?.ConvertToEnum<DeclStateForQuery_Type>() ?? default,
            DeclStateSpecified = query.DeclarationState != null,
            DocId = query.DocumentId,
            StateDateFrom = query.StateDateFrom ?? default,
            StateDateFromSpecified = query.StateDateFrom != null,
            StateDateTo = query.StateDateTo ?? default,
            StateDateToSpecified = query.StateDateTo != null
        };

        return queryNew;
    }

    public static QueryDeclarationsResponse ToInternalType(this queryDeclarationsResponse1 response)
    {
        return new QueryDeclarationsResponse
        {
            Declarations = response.queryDeclarationsResponse.Item is DeclList_Type declList
                ? declList.ToInternalType()
                : null,
            Errors = response.queryDeclarationsResponse.Item is Errors_Type errors
                ? errors.Error.ToInternalType()
                : null,
            ResultDate = response.queryDeclarationsResponse.ResultDate,
            ResultStatus = response.queryDeclarationsResponse.ResultStatus
                .ConvertToEnum<ResultStatus>()
        };
    }

    private static IReadOnlyList<QueryDeclarationsDeclaration> ToInternalType(
        this DeclList_Type declList
    )
    {
        return declList
            .DeclListItem
            .Select(
                i => new QueryDeclarationsDeclaration
                {
                    DeclarationState = i.DeclState.ConvertToEnum<QueryDeclarationsState>(),
                    DocumentCorrectionNoCustoms = i.DocCorrNoCostums,
                    DocumentCorrectionNoLast = i.DocCorrNoLast,
                    DocumentId = i.DocId,
                    StateDate = i.StateDate
                }
            )
            .ToImmutableList();
    }
}