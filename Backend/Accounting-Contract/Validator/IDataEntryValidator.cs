using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataEntry;
using DataEntry = Accounting.Contract.Entity.DataEntry;

namespace Accounting.Contract.Validator;

public interface IDataEntryValidator : IInstanceEntityValidator<DataEntry>
{
    public Task<Validation> ValidateDataEntryCreateRequestAsync(DataEntryCreateRequest request);

    public Task<Validation> ValidateDataEntryEditRequestAsync(DataEntryEditRequest request);

    public Task<Validation> ValidateDataEntryFieldCreateRequestAsync(DataEntryFieldCreateRequest request);

    public Task<Validation> ValidateDataEntryFieldEditRequestAsync(DataEntryFieldEditRequest request);
}