import {FieldType} from './data-type-field.model';

export default interface Report {
  entries: ReportEntry[];
  header: string[];
  info: ReportInfo;
}

export interface ReportEntry {
  fields: ReportEntryField[];
}

export interface ReportEntryField {
  type: FieldType;
  value: any;
}

export interface ReportInfo {
  fields: ReportInfoField[];
}

export interface ReportInfoField {
  name: string;
  type: FieldType;
  value: any;
}

export interface GenerateDataEntriesReportRequest {
  from: Date;
  instanceId: number;
  reportTemplateId: number;
  to: Date;
}

export interface GenerateSalesReportsRequest {
  customerId: number;
  from: Date;
  instanceId: number;
  salesmanId: number;
  to: Date;
}

export interface Reports {
  reports: Report[];
}
