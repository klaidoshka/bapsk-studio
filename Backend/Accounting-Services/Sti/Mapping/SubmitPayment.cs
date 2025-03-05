using Accounting.Contract.Sti;
using Accounting.Contract.Sti.SubmitPaymentInfo;
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

    private static PaymentInfo_TypePayment[] ToExternalType(
        this IReadOnlyList<SubmitPaymentInfo> payments
    )
    {
        return payments
            .Select(
                p => new PaymentInfo_TypePayment
                {
                    Amount = p.Amount,
                    Date = p.Date,
                    Type = p.Type.ConvertToEnum<PaymentInfo_TypePaymentType>()
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
            TransmissionId = response.submitPaymentInfoResponse.TransmissionIDSpecified
                ? response.submitPaymentInfoResponse.TransmissionID
                : null
        };
    }
}