using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Dto.Sti.VatReturn.Payment;

namespace Accounting.Contract.Dto.Sti.VatReturn;

public class StiVatReturnDeclarationWithSale : StiVatReturnDeclaration
{
    public Sale.Sale Sale { get; set; }
}

public static class StiVatReturnDeclarationWithSaleExtensions
{
    public static StiVatReturnDeclarationWithSale ToDtoWithSale(this Entity.StiVatReturnDeclaration declaration)
    {
        return new StiVatReturnDeclarationWithSale
        {
            Correction = declaration.Correction,
            DeclaredById = declaration.DeclaredById,
            Export = declaration.Export?.ToDto(),
            Id = declaration.Id,
            InstanceId = declaration.InstanceId,
            IsCancelled = declaration.IsCancelled,
            Payments = declaration.Payments
                .Select(it => it.ToDto())
                .ToList(),
            QrCodes = declaration.QrCodes
                .Select(it => it.Value)
                .ToList(),
            Sale = declaration.Sale.ToDto(),
            SaleId = declaration.SaleId,
            State = declaration.State,
            SubmitDate = declaration.SubmitDate
        };
    }
}