using Accounting.Contract.Dto.Report;

namespace Accounting.Contract.Service;

public interface IReportService
{
    public Task<Report> GenerateDataEntriesReportAsync(ReportByDataEntriesGenerateRequest request);

    public Task<IList<Report>> GenerateSalesReportAsync(ReportBySalesGenerateRequest request);
}