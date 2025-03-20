using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface ICountryService
{
    public IsoCountryCode GetCountryCode(string name);
}