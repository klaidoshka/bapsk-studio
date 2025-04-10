using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.Qr;

public class QrCodeDocument
{
    public QrCodeDocumentHeader DocHeader { get; set; } = null!;
    public QrCodeCustomer Customer { get; set; } = null!;
    public IList<QrCodeSoldGood> Goods { get; set; } = new List<QrCodeSoldGood>();
}

public static class QrCodeDocumentExtensions
{
    public static QrCodeDocument ToQrCodeDocument(this Entity.StiVatReturnDeclaration declaration)
    {
        return new QrCodeDocument
        {
            DocHeader = new QrCodeDocumentHeader
            {
                CompletionDate = declaration.SubmitDate.Date,
                DocCorrNo = declaration.Correction,
                DocId = declaration.Id
            },
            Customer = new QrCodeCustomer
            {
                FirstName = declaration.Sale.Customer.FirstName,
                LastName = declaration.Sale.Customer.LastName,
                IdentityDocumentNo = declaration.Sale.Customer.IdentityDocumentNumber
            },
            Goods = declaration.Sale.SoldGoods
                .OrderBy(it => it.SequenceNo)
                .Select(
                    it =>
                    {
                        var good = new QrCodeSoldGood
                        {
                            Description = it.Description,
                            Quantity = it.Quantity,
                            SequenceNo = it.SequenceNo,
                            TotalAmount = Math.Round(it.TotalAmount, 2)
                        };

                        if (it.UnitOfMeasureType == UnitOfMeasureType.UnitOfMeasureOther)
                        {
                            good.UnitOfMeasureOther = it.UnitOfMeasure;
                        }
                        else
                        {
                            good.UnitOfMeasureCode = it.UnitOfMeasure;
                        }

                        return good;
                    }
                )
                .ToList()
        };
    }
}