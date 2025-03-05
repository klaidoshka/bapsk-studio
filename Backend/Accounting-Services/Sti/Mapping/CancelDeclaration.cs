using Accounting.Contract.Dto.StiVatReturn;
using Accounting.Contract.Dto.StiVatReturn.CancelDeclaration;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class CancelDeclaration
{
    public static cancelDeclarationRequest ToExternalType(this CancelDeclarationRequest request)
    {
        return new cancelDeclarationRequest
        {
            DocId = request.DocumentId,
            RequestId = request.RequestId,
            SenderIn = request.SenderId,
            TimeStamp = request.TimeStamp
        };
    }

    public static CancelDeclarationResponse ToInternalType(this cancelDeclarationResponse1 response)
    {
        return new CancelDeclarationResponse
        {
            Errors = response.cancelDeclarationResponse.Errors.ToInternalType(),
            ResultDate = response.cancelDeclarationResponse.ResultDate,
            ResultStatus = response.cancelDeclarationResponse.ResultStatus
                .ConvertToEnum<ResultStatus>()
        };
    }
}