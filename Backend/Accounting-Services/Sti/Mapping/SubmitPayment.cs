using Accounting.Contract.Sti.Data;
using Accounting.Contract.Sti.Data.SubmitPaymentInfo;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class SubmitPayment
{
    public static submitPaymentInfoRequest ToExternalType(this SubmitPaymentInfoRequest request)
    {
        return new submitPaymentInfoRequest
        {
            DocId = request.DocumentId,
            PaymentInfo = request.PaymentInfo.ToExternalType(),
            RequestId = request.RequestId,
            SenderIn = request.SenderId,
            TimeStamp = request.TimeStamp
        };
    }

    private static PaymentInfo_TypePayment[] ToExternalType(this IReadOnlyList<SubmitPaymentInfo> payments)
    {
        return payments
            .Select(
                p => new PaymentInfo_TypePayment
                {
                    Amount = p.Amount,
                    Date = p.PaymentDate,
                    Type = p.PaymentType.ConvertToEnum<PaymentInfo_TypePaymentType>()
                }
            )
            .ToArray();
    }

    public static SubmitPaymentInfoResponse ToInternalType(this submitPaymentInfoResponse1 response)
    {
        return new SubmitPaymentInfoResponse
        {
            Errors = response.submitPaymentInfoResponse.Errors.ToInternalType(),
            ResultDate = response.submitPaymentInfoResponse.ResultDate,
            ResultStatus = response.submitPaymentInfoResponse.ResultStatus
                .ConvertToEnum<ResultStatus>(),
            TransmissionId = response.submitPaymentInfoResponse.TransmissionID,
            TransmissionIdSpecified = response.submitPaymentInfoResponse.TransmissionIDSpecified
        };
    }
}