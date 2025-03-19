using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sti.VatReturn;

namespace Accounting.Contract.Validator;

public interface IVatReturnValidator
{
    public Task<Validation> ValidateSubmitRequestAsync(StiVatReturnDeclarationSubmitRequest request);
}