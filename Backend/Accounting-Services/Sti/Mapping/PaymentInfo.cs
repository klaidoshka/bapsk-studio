using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Dto.Sti.VatReturn.Payment;
using Accounting.Contract.Entity;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class PaymentInfoExtensions
{
    public static submitPaymentInfoRequest ToExternalType(this PaymentInfoSubmitRequest request)
    {
        return new submitPaymentInfoRequest
        {
            DocId = request.DocumentId,
            PaymentInfo = request.Payments.ToExternalType(),
            RequestId = request.RequestId,
            SenderIn = request.SenderId,
            TimeStamp = request.TimeStamp
        };
    }

    private  static PaymentInfo_TypePayment[] ToExternalType(this IList<PaymentInfo> payments)
    {
        return payments
            .Select(
                it => new PaymentInfo_TypePayment
                {
                    Amount = it.Amount,
                    Date = it.Date,
                    Type = it.Type.ToExternalType()
                }
            )
            .ToArray();
    }

    private static PaymentInfo_TypePaymentType ToExternalType(this PaymentType type)
    {
        return type switch
        {
            PaymentType.Cash => PaymentInfo_TypePaymentType.Item1,
            PaymentType.Bank => PaymentInfo_TypePaymentType.Item2,
            PaymentType.Other => PaymentInfo_TypePaymentType.Item3,
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
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