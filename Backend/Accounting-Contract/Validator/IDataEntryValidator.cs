using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataEntry;

namespace Accounting.Contract.Validator;

public interface IDataEntryValidator
{
    public Task<Validation> ValidateDataEntryCreateRequestAsync(DataEntryCreateRequest request);

    public Task<Validation> ValidateDataEntryDeleteRequestAsync(DataEntryDeleteRequest request);

    public Task<Validation> ValidateDataEntryEditRequestAsync(DataEntryEditRequest request);

    public Task<Validation> ValidateDataEntryGetRequestAsync(DataEntryGetRequest request);

    public Task<Validation> ValidateDataEntryGetByDataTypeRequestAsync(DataEntryGetByDataTypeRequest request);

    public Task<Validation> ValidateDataEntryFieldCreateRequestAsync(DataEntryFieldCreateRequest request);

    public Task<Validation> ValidateDataEntryFieldEditRequestAsync(DataEntryFieldEditRequest request);
}