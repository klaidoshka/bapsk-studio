using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Session;

namespace Accounting.Contract.Validator;

public interface ISessionValidator
{
    public Task<Validation> ValidateSessionDeleteRequestAsync(SessionDeleteRequest request);

    public Task<Validation> ValidateSessionGetRequestAsync(SessionGetRequest request);
}