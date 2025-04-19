import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {map, Observable} from 'rxjs';
import Report, {GenerateDataEntriesReportRequest, GenerateSalesReportsRequest} from '../model/report.model';
import {HttpClient} from '@angular/common/http';
import {EnumUtil} from '../util/enum.util';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';

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

  generateDataEntryReports(request: GenerateDataEntriesReportRequest): Observable<Report[]> {
    return this.httpClient
      .post<Report>(
        this.apiRouter.report.generateDataEntries(),
        this.adjustRequestDateToISO(request)
      )
      .pipe(
        map(report => this.updateProperties([report]))
      );
  }

  generateSaleReports(request: GenerateSalesReportsRequest): Observable<Report[]> {
    return this.httpClient
      .post<Report[]>(
        this.apiRouter.report.generateSales(),
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
    }))
  }
}
