import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {map, Observable} from 'rxjs';
import Report, {GenerateDataEntriesReportRequest, GenerateSalesReportsRequest} from '../model/report.model';
import {HttpClient} from '@angular/common/http';
import {EnumUtil} from '../util/enum.util';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import {InstanceService} from './instance.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly instanceService = inject(InstanceService);

  private readonly instanceId = this.instanceService.getActiveInstanceId();

  private adjustRequestDateToISO<T extends GenerateDataEntriesReportRequest | GenerateSalesReportsRequest>(request: T): T {
    return {
      ...request,
      from: request.from.toISOString() as any,
      to: request.to.toISOString() as any
    };
  }

  export(element: HTMLElement) {
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

  generateDataEntryReports(request: GenerateDataEntriesReportRequest): Observable<Report[]> {
    return this.httpClient
      .post<Report>(
        this.apiRouter.report.generateDataEntries(this.instanceId()!),
        this.adjustRequestDateToISO(request)
      )
      .pipe(
        map(report => this.updateProperties([report]))
      );
  }

  generateSaleReports(request: GenerateSalesReportsRequest): Observable<Report[]> {
    return this.httpClient
      .post<Report[]>(
        this.apiRouter.report.generateSales(this.instanceId()!),
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
