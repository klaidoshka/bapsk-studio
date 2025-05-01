import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {map, Observable} from 'rxjs';
import Report, {
  GenerateDataEntriesReportRequest,
  GenerateSalesReportsRequest,
  ReportEntry
} from '../model/report.model';
import {HttpClient} from '@angular/common/http';
import {EnumUtil} from '../util/enum.util';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import {DateUtil} from '../util/date.util';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);

  private adjustRequestDateToISO<T extends GenerateDataEntriesReportRequest | GenerateSalesReportsRequest>(request: T): T {
    return {
      ...request,
      from: request.from.toISOString() as any,
      to: request.to.toISOString() as any
    };
  }

  private escapeCsvValue(value: string): string {
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }

  exportToPdf(element: HTMLElement) {
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })
      .then(canvas => {
        const pdf = new jsPDF();
        const png = canvas.toDataURL('image/png');
        pdf.addImage(png, 'PNG', 5, 5, 200, 0);
        pdf.save('report.pdf');
      });
  }

  exportToCsv(values: ReportEntry[]) {
    const rows = values.map(entry =>
      entry.fields
        .map(field => this.escapeCsvValue(
          field.type === FieldType.Date
            ? DateUtil.toString(field.value)
            : String(field.value))
        )
        .join(',')
    );

    const content = 'data:text/csv;charset=utf-8,' + rows.join('\n');
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'report.csv');

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  generateDataEntryReports(request: GenerateDataEntriesReportRequest): Observable<Report[]> {
    return this.httpClient
      .post<Report>(
        this.apiRouter.report.generateDataEntries(request.instanceId),
        this.adjustRequestDateToISO(request)
      )
      .pipe(
        map(report => this.updateProperties([report]))
      );
  }

  generateSaleReports(request: GenerateSalesReportsRequest): Observable<Report[]> {
    return this.httpClient
      .post<Report[]>(
        this.apiRouter.report.generateSales(request.instanceId),
        this.adjustRequestDateToISO(request)
      )
      .pipe(
        map(reports => this.updateProperties(reports))
      );
  }

  updateProperties(reports: Report[]): Report[] {
    return reports.map(report => ({
      ...report,
      entries: report.entries.map(entry => ({
        ...entry,
        fields: entry.fields.map(field => {
          const type = EnumUtil.toEnumOrThrow(field.type, FieldType);
          return {
            ...field,
            type: type,
            value: FieldTypeUtil.updateValue(field.value, type)
          };
        })
      })),
      info: {
        ...report.info,
        fields: report.info.fields.map(field => {
          const type = EnumUtil.toEnumOrThrow(field.type, FieldType);
          return {
            ...field,
            type: type,
            value: FieldTypeUtil.updateValue(field.value, type)
          };
        })
      }
    }));
  }
}
