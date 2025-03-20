using Accounting.Contract.Entity;
using Accounting.Contract.Service;

namespace Accounting.Services.Service;

public class CountryService : ICountryService
{
    public IsoCountryCode GetCountryCode(string name)
    {
        // TODO: Implement this method
        return IsoCountryCode.LT;
    }
}