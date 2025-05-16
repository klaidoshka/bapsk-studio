import DataTypeField from './data-type-field.model';
import {UserIdentity} from './user.model';

export default interface ReportTemplate {
  createdById: number;
  fields: DataTypeField[];
  id: number;
  name: string;
}

export interface ReportTemplateWithCreator extends ReportTemplate {
  createdBy: UserIdentity;
}

export interface ReportTemplateCreateEdit {
  fields: number[];
  id: number;
  name: string;
}

export interface ReportTemplateCreateRequest {
  instanceId: number;
  reportTemplate: ReportTemplateCreateEdit;
}

export interface ReportTemplateEditRequest {
  instanceId: number;
  reportTemplate: ReportTemplateCreateEdit;
}
