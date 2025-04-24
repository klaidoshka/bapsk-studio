using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sale;
using Sale = Accounting.Contract.Entity.Sale;

namespace Accounting.Contract.Validator;

public interface ISaleValidator : IInstanceEntityValidator<Sale>
{
    public Validation ValidateSale(SaleCreateEdit sale, bool includeSoldGoods = true);

    public Task<Validation> ValidateDeleteRequestAsync(int saleId);

    public Task<Validation> ValidateEditRequestAsync(SaleCreateEdit sale);

    public Task<Validation> ValidateExistsAsync(int saleId);

    public Task<Validation> ValidateGetByIdRequestAsync(int saleId);

    public Task<Validation> ValidateGetRequestAsync(int instanceId);

    public Validation ValidateSoldGood(SoldGoodCreateEdit soldGood, int? sequenceNo = null);

    public Validation ValidateSoldGoods(ICollection<SoldGoodCreateEdit> soldGoods);

    public Validation ValidateVatReturnSale(Dto.Sale.Sale sale);

    public Validation ValidateVatReturnSoldGood(SoldGoodCreateEdit soldGood, int? sequenceNo = null);

    public Validation ValidateVatReturnSoldGoods(ICollection<SoldGoodCreateEdit> soldGoods);
}