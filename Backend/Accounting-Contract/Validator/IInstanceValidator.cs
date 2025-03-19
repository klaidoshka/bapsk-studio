using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Instance;

namespace Accounting.Contract.Validator;

public interface IInstanceValidator
{
    public Task<Validation> ValidateCreateRequestAsync(InstanceCreateRequest request);

    public Task<Validation> ValidateDeleteRequestAsync(InstanceDeleteRequest request);

    public Task<Validation> ValidateEditRequestAsync(InstanceEditRequest request);

    public Task<Validation> ValidateExistsAsync(int instanceId);

    public Task<Validation> ValidateGetRequestAsync(InstanceGetRequest request);
}