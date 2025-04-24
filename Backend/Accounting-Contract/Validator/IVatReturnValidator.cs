using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sti.VatReturn;
using StiVatReturnDeclaration = Accounting.Contract.Entity.StiVatReturnDeclaration;

namespace Accounting.Contract.Validator;

public interface IVatReturnValidator : IInstanceEntityValidator<StiVatReturnDeclaration>
{
    public Task<Validation> ValidateSubmitRequestAsync(StiVatReturnDeclarationSubmitRequest request);
}