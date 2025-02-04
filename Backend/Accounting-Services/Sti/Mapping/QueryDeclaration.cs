using System.Collections.Immutable;
using Accounting.Contract.Sti.Data;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class QueryDeclaration
{
    public static queryDeclarationsRequest1 ToExternalType(this QueryDeclarationsRequest request)
    {
        return new queryDeclarationsRequest1(
            new queryDeclarationsRequest
            {
                Query = request.Query.ToExternalType(),
                RequestId = request.RequestId,
                SenderIn = request.SenderId,
                TimeStamp = request.TimeStamp
            }
        );
    }

    private static queryDeclarationsRequestQuery ToExternalType(this Query query)
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
            Errors = response.queryDeclarationsResponse.Item is Errors_TypeError[] errors
                ? errors.ToInternalType()
                : null,
            ResultDate = response.queryDeclarationsResponse.ResultDate,
            ResultStatus = response.queryDeclarationsResponse.ResultStatus
                .ConvertToEnum<ResultStatus>()
        };
    }

    private static IReadOnlyList<Contract.Sti.Data.QueryDeclaration> ToInternalType(
        this DeclList_Type declList)
    {
        return declList.DeclListItem
            .Select(i => new Contract.Sti.Data.QueryDeclaration
            {
                DeclarationState = i.DeclState.ConvertToEnum<QueryDeclarationState>(),
                DocumentCorrectionNoCustoms = i.DocCorrNoCostums,
                DocumentCorrectionNoLast = i.DocCorrNoLast,
                DocumentId = i.DocId,
                StateDate = i.StateDate
            })
            .ToImmutableList();
    }
}