using System.Collections.Immutable;
using System.Globalization;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Dto.Report;
using Accounting.Contract.Dto.ReportTemplate;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Sale = Accounting.Contract.Entity.Sale;
using SoldGood = Accounting.Contract.Entity.SoldGood;

namespace Accounting.Services.Service;

public class ReportService : IReportService
{
    private static readonly IList<string> SaleReportHeader = ImmutableList.Create(
        nameof(SoldGood.SequenceNo),
        nameof(SoldGood.Description),
        nameof(SoldGood.Quantity),
        nameof(SoldGood.UnitOfMeasure),
        nameof(SoldGood.TotalAmount),
        nameof(SoldGood.VatAmount),
        nameof(SoldGood.VatRate)
    );

    private readonly ICustomerService _customerService;
    private readonly IDataEntryService _dataEntryService;
    private readonly IInstanceAuthorizationService _instanceAuthorizationService;
    private readonly IReportTemplateService _reportTemplateService;
    private readonly ISalesmanService _salesmanService;
    private readonly ISaleService _saleService;

    public ReportService(
        ICustomerService customerService,
        IDataEntryService dataEntryService,
        IInstanceAuthorizationService instanceAuthorizationService,
        IReportTemplateService reportTemplateService,
        ISalesmanService salesmanService,
        ISaleService saleService
    )
    {
        _customerService = customerService;
        _dataEntryService = dataEntryService;
        _instanceAuthorizationService = instanceAuthorizationService;
        _reportTemplateService = reportTemplateService;
        _salesmanService = salesmanService;
        _saleService = saleService;
    }

    private static IDictionary<string, string> CreateSaleReportInfo(Customer customer, Salesman salesman, Sale sale)
    {
        var info = new OrderedDictionary<string, string>();

        info["Customer"] = (customer.FirstName + " " + customer.LastName).Trim();
        info["Customer ID Number"] = customer.IdentityDocumentNumber;

        if (customer.Email is not null)
        {
            info["Customer Email"] = customer.Email;
        }

        info["Salesman"] = salesman.Name;
        info["Salesman VAT Payer Code"] = salesman.VatPayerCode;
        info["Sale Date"] = sale.Date.ToLongDateString();

        if (sale.InvoiceNo is not null)
        {
            info["Invoice No"] = sale.InvoiceNo;
        }
        else
        {
            info["Cash Register No"] = sale.CashRegisterNo!;
            info["Cash Register Receipt No"] = sale.CashRegisterReceiptNo!;
        }

        return info;
    }

    public async Task<Report> GenerateDataEntriesReportAsync(ReportByDataEntriesGenerateRequest request)
    {
        var instanceId = await _reportTemplateService.GetInstanceIdAsync(request.ReportTemplateId);

        if (!await _instanceAuthorizationService.IsMemberAsync(instanceId, request.RequesterId))
        {
            throw new ValidationException("You are not authorized to generate this report.");
        }

        var template = await _reportTemplateService.GetAsync(
            new ReportTemplateGetRequest
            {
                ReportTemplateId = request.ReportTemplateId,
                RequesterId = request.RequesterId
            }
        );

        var entries = (await Task.WhenAll(
                template.Fields
                    .Select(field => field.DataTypeId)
                    .Distinct()
                    .Select(dataTypeId =>
                        _dataEntryService.GetAsync(
                            new DataEntryGetWithinIntervalRequest
                            {
                                DataTypeId = dataTypeId,
                                From = request.From,
                                To = request.To
                            }
                        )
                    )
                    .ToList()
            ))
            .SelectMany(entries => entries)
            .ToList();

        var dataTypeFieldIds = template.Fields
            .Select(field => field.Id)
            .ToList();

        return new Report
        {
            Entries = entries
                .Select(entry => entry.Fields
                    .Select(field =>
                        dataTypeFieldIds.Contains(field.Id)
                            ? field.Value
                            : String.Empty
                    )
                    .ToList()
                )
                .ToList<IList<string>>(),
            Header = template.Fields
                .Select(field => field.Name)
                .ToList()
        };
    }

    public async Task<IList<Report>> GenerateSalesReportAsync(ReportBySalesGenerateRequest request)
    {
        var customer = await _customerService.GetByIdAsync(request.CustomerId);
        var salesman = await _salesmanService.GetByIdAsync(request.SalesmanId);

        if (customer.InstanceId != salesman.InstanceId)
        {
            throw new ValidationException("Customer and salesman must belong to the same instance.");
        }

        if (
            customer.InstanceId is not null &&
            !await _instanceAuthorizationService.IsMemberAsync(customer.InstanceId!.Value, request.RequesterId)
        )
        {
            throw new ValidationException("You are not authorized to generate this report.");
        }

        var sales = await _saleService.GetAsync(
            new SaleWithinIntervalGetRequest
            {
                CustomerId = request.CustomerId,
                From = request.From,
                SalesmanId = request.SalesmanId,
                To = request.To
            }
        );

        return sales
            .Select(sale => new Report
                {
                    Entries = sale.SoldGoods
                        .Select(soldGood =>
                            new List<string>
                            {
                                soldGood.SequenceNo.ToString(),
                                soldGood.Description,
                                soldGood.Quantity.ToString(CultureInfo.InvariantCulture),
                                soldGood.UnitOfMeasure,
                                soldGood.TotalAmount.ToString(CultureInfo.InvariantCulture),
                                soldGood.VatAmount.ToString(CultureInfo.InvariantCulture),
                                soldGood.VatRate.ToString(CultureInfo.InvariantCulture)
                            }
                        )
                        .ToList<IList<string>>(),
                    Header = SaleReportHeader,
                    Info = CreateSaleReportInfo(customer, salesman, sale),
                }
            )
            .ToList();
    }
}