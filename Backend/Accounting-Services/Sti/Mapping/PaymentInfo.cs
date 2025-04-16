using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Dto.Sti.VatReturn.Payment;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class PaymentInfoExtensions
{
    public static submitPaymentInfoRequest ToExternalType(this PaymentInfoSubmitRequest request)
    {
        return new submitPaymentInfoRequest
        {
            DocId = request.DocumentId,
            RequestId = request.RequestId,
            SenderIn = request.SenderId,
            TimeStamp = request.TimeStamp
        };
    }

    public static PaymentInfoSubmitResponse ToInternalType(this submitPaymentInfoResponse1 response)
    {
        return new PaymentInfoSubmitResponse
        {
            Errors = response.submitPaymentInfoResponse.Errors?.ToInternalType() ?? [],
            ResultDate = response.submitPaymentInfoResponse.ResultDate,
            ResultStatus = response.submitPaymentInfoResponse.ResultStatus.ConvertToEnum<ResultStatus>()
        };
    }
}