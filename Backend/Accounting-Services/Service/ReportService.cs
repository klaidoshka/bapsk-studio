using System.Collections.Immutable;
using System.Globalization;
using System.Text;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Dto.DataType;
using Accounting.Contract.Dto.Report;
using Accounting.Contract.Dto.ReportTemplate;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using DataEntry = Accounting.Contract.Entity.DataEntry;
using DataTypeField = Accounting.Contract.Entity.DataTypeField;
using Sale = Accounting.Contract.Entity.Sale;
using SoldGood = Accounting.Contract.Entity.SoldGood;

namespace Accounting.Services.Service;

public class ReportService : IReportService
{
    private static readonly IList<string> SaleReportHeader = ImmutableList.Create(
        "Sequence No",
        "Description",
        "Quantity",
        "Measurement Unit",
        "Total Amount",
        "VAT Amount",
        "VAT Rate"
    );

    private readonly Butenta _butenta;
    private readonly ICustomerService _customerService;
    private readonly IDataEntryService _dataEntryService;
    private readonly IDataTypeService _dataTypeService;
    private readonly IReportTemplateService _reportTemplateService;
    private readonly ISalesmanService _salesmanService;
    private readonly ISaleService _saleService;

    public ReportService(
        Butenta butenta,
        ICustomerService customerService,
        IDataEntryService dataEntryService,
        IDataTypeService dataTypeService,
        IReportTemplateService reportTemplateService,
        ISalesmanService salesmanService,
        ISaleService saleService
    )
    {
        _butenta = butenta;
        _customerService = customerService;
        _dataEntryService = dataEntryService;
        _dataTypeService = dataTypeService;
        _reportTemplateService = reportTemplateService;
        _salesmanService = salesmanService;
        _saleService = saleService;
    }

    private static ReportEntry CreateDataEntryReportEntry(
        DataEntry entry,
        Dictionary<int, DataTypeField> templateDataTypeFields,
        Dictionary<int, ReportEntryField> referenceDataEntryToDisplay
    )
    {
        return new ReportEntry
        {
            Fields = templateDataTypeFields.Keys
                .Select(dataTypeFieldId =>
                    {
                        var entryField = entry.Fields.FirstOrDefault(f => f.DataTypeFieldId == dataTypeFieldId);

                        if (entryField is null)
                        {
                            return CreateReportEntryField(String.Empty);
                        }

                        if (referenceDataEntryToDisplay.TryGetValue(entryField.Id, out var reportEntryField))
                        {
                            return reportEntryField;
                        }

                        templateDataTypeFields.TryGetValue(dataTypeFieldId, out var dataTypeField);

                        return CreateReportEntryField(
                            dataTypeField is not null
                                ? entryField.Value
                                : String.Empty,
                            dataTypeField?.Type ?? FieldType.Text
                        );
                    }
                )
                .ToList()
        };
    }

    private static ReportInfo CreateDataEntryReportInfo(DateTime from, DateTime to, string templateName)
    {
        return new ReportInfo
        {
            Fields = new List<ReportInfoField>
            {
                CreateReportInfoField("Report Template", templateName),
                CreateReportInfoField("Report From", from.ToString("u"), FieldType.Date),
                CreateReportInfoField("Report To", to.ToString("u"), FieldType.Date)
            }
        };
    }

    private static ReportEntryField CreateReportEntryField(string value, FieldType type = FieldType.Text)
    {
        return new ReportEntryField
        {
            Type = type,
            Value = value
        };
    }

    private static ReportInfoField CreateReportInfoField(string name, string value, FieldType type = FieldType.Text)
    {
        return new ReportInfoField
        {
            Name = name,
            Type = type,
            Value = value
        };
    }

    private static ReportEntry CreateSaleReportEntry(SoldGood soldGood)
    {
        return new ReportEntry
        {
            Fields = new List<ReportEntryField>
            {
                CreateReportEntryField(soldGood.SequenceNo.ToString(), FieldType.Number),
                CreateReportEntryField(soldGood.Description),
                CreateReportEntryField(
                    soldGood.Quantity.ToString(CultureInfo.InvariantCulture),
                    FieldType.Number
                ),
                CreateReportEntryField(soldGood.UnitOfMeasure),
                CreateReportEntryField(
                    soldGood.TotalAmount.ToString(CultureInfo.InvariantCulture),
                    FieldType.Currency
                ),
                CreateReportEntryField(
                    soldGood.VatAmount.ToString(CultureInfo.InvariantCulture),
                    FieldType.Currency
                ),
                CreateReportEntryField(
                    soldGood.VatRate.ToString(CultureInfo.InvariantCulture),
                    FieldType.Number
                )
            }
        };
    }

    private static ReportInfo CreateSaleReportInfo(Customer customer, Salesman salesman, Sale sale, DateTime from, DateTime to)
    {
        var fields = new List<ReportInfoField>
        {
            CreateReportInfoField("Report Template", "Sales"),
            CreateReportInfoField("Report From", from.ToString("u"), FieldType.Date),
            CreateReportInfoField("Report To", to.ToString("u"), FieldType.Date),
            CreateReportInfoField("Customer", $"{customer.FirstName} {customer.LastName}".Trim()),
            CreateReportInfoField("Customer Identity Document Number", customer.IdentityDocumentNumber),
            CreateReportInfoField("Salesman", salesman.Name),
            CreateReportInfoField("Salesman VAT Payer Code", salesman.VatPayerCode),
            CreateReportInfoField("Sale Date", sale.Date.ToString("u"), FieldType.Date)
        };

        if (customer.Email is not null)
        {
            fields.Insert(5, CreateReportInfoField("Customer Email", customer.Email));
        }

        if (sale.InvoiceNo is not null)
        {
            fields.Add(CreateReportInfoField("Invoice No", sale.InvoiceNo));
        }
        else
        {
            fields.Add(CreateReportInfoField("Cash Register No", sale.CashRegisterNo!));
            fields.Add(CreateReportInfoField("Cash Register Receipt No", sale.CashRegisterReceiptNo!));
        }

        return new ReportInfo
        {
            Fields = fields
        };
    }

    public async Task<Report> GenerateDataEntriesReportAsync(ReportByDataEntriesGenerateRequest request)
    {
        var template = await _reportTemplateService.GetAsync(
            new ReportTemplateGetRequest
            {
                ReportTemplateId = request.ReportTemplateId,
                RequesterId = request.RequesterId
            }
        );

        var templateDataTypeIds = template.Fields
            .Select(field => field.DataTypeId)
            .Distinct()
            .ToList();

        var dataEntries = new List<DataEntry>();

        foreach (var dataTypeId in templateDataTypeIds)
        {
            dataEntries.AddRange(
                await _dataEntryService.GetAsync(
                    new DataEntryGetWithinIntervalRequest
                    {
                        DataTypeId = dataTypeId,
                        From = request.From,
                        To = request.To
                    }
                )
            );
        }

        var templateDataTypeFields = template.Fields.ToDictionary(f => f.Id);

        var dataEntryFieldReferenceMetas = dataEntries
            .SelectMany(dataEntry => dataEntry.Fields
                .Where(field =>
                    templateDataTypeFields.TryGetValue(field.DataTypeFieldId, out var dataTypeField) &&
                    dataTypeField.Type == FieldType.Reference
                )
                .DistinctBy(field => field.Id)
                .Select(field => new
                    {
                        DataEntryFieldId = field.Id,
                        ReferenceId = field.DataTypeField.ReferenceId!.Value,
                        Value = Int32.Parse(field.Value)
                    }
                )
            )
            .ToList();

        var referenceFields = new List<ReferencedFieldDisplay>();

        foreach (var meta in dataEntryFieldReferenceMetas)
        {
            var field = await _dataTypeService.GetAsync(
                new DataTypeGetRequest
                {
                    DataTypeId = meta.ReferenceId,
                    RequesterId = request.RequesterId
                }
            );

            referenceFields.Add(
                new(
                    meta.DataEntryFieldId,
                    meta.Value,
                    field.DisplayFieldId
                )
            );
        }

        var referenceReportEntryFields = new Dictionary<int, ReportEntryField>();

        foreach (var field in referenceFields)
        {
            var dataEntry = await _dataEntryService.GetAsync(
                new DataEntryGetRequest
                {
                    DataEntryId = field.DataEntryFieldValue,
                    RequesterId = request.RequesterId
                }
            );

            var dataEntryField = dataEntry.Fields.FirstOrDefault(f => f.DataTypeFieldId == field.ReferenceDisplayFieldId);

            referenceReportEntryFields[field.DataEntryFieldId] = new ReportEntryField
            {
                Type = dataEntryField?.DataTypeField.Type ?? FieldType.Text,
                Value = dataEntryField?.Value ?? dataEntry.Id.ToString()
            };
        }

        var reportEntries = dataEntries
            .Select(entry => CreateDataEntryReportEntry(entry, templateDataTypeFields, referenceReportEntryFields))
            .ToList();

        return new Report
        {
            Entries = reportEntries,
            Header = template.Fields
                .Select(field => field.Name)
                .ToList(),
            Info = CreateDataEntryReportInfo(request.From, request.To, template.Name)
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
                        .Select(CreateSaleReportEntry)
                        .ToList(),
                    Header = SaleReportHeader,
                    Info = CreateSaleReportInfo(customer, salesman, sale, request.From, request.To),
                }
            )
            .ToList();
    }

    public async Task<string> UpdateHtmlAsync(string html)
    {
        using var client = new HttpClient();

        var request = new HttpRequestMessage(HttpMethod.Post, _butenta.UpdateHtmlEndpoint)
        {
            Content = new StringContent(html, Encoding.UTF8, "text/html")
        };

        try
        {
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }

            var errorMessage = await response.Content.ReadAsStringAsync();

            throw new ValidationException($"{response.StatusCode} - {errorMessage}");
        }
        catch (HttpRequestException ex)
        {
            throw new ValidationException(ex.Message);
        }
    }
}