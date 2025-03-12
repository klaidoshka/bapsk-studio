using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

namespace Accounting.Contract.Dto.Sti.VatReturn;

public class StiVatReturnDeclaration
{
    public int Correction { get; set; }
    public int? DeclaredById { get; set; }
    public string Id { get; set; }
    public int? InstanceId { get; set; }
    public int SaleId { get; set; }
    public SubmitDeclarationState? State { get; set; }
    public DateTime SubmitDate { get; set; }
}

public static class StiVatReturnDeclarationExtensions
{
    public static StiVatReturnDeclaration ToDto(this Entity.StiVatReturnDeclaration declaration)
    {
        return new StiVatReturnDeclaration
        {
            Correction = declaration.Correction,
            DeclaredById = declaration.DeclaredById,
            Id = declaration.Id,
            InstanceId = declaration.InstanceId,
            SaleId = declaration.SaleId,
            State = declaration.State,
            SubmitDate = declaration.SubmitDate
        };
    }
}