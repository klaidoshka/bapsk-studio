using System.Collections.Immutable;
using Account.Services;
using Accounting.Contract.Sti;
using Accounting.Contract.Sti.Data;
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
            SenderIn = request.SenderIn,
            TimeStamp = request.TimeStamp
        };
    }

    private static queryDeclarationsRequestQuery ToExternalType(this Query query)
    {
        return new queryDeclarationsRequestQuery
        {
            DeclState = query.DeclarationState.ConvertToEnum<DeclStateForQuery_Type>(),
            DeclStateSpecified = query.DeclStateSpecified,
            DocId = query.DocumentId,
            StateDateFrom = query.StateDateFrom,
            StateDateFromSpecified = query.StateDateFromSpecified,
            StateDateTo = query.StateDateTo,
            StateDateToSpecified = query.StateDateToSpecified
        };
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

    private static IReadOnlyList<Contract.Sti.Data.QueryDeclaration> ToInternalType(this DeclList_Type declList)
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