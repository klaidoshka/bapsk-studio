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
  reportTemplate: ReportTemplateCreateEdit;
  instanceId: number;
}

export interface ReportTemplateEditRequest {
  reportTemplate: ReportTemplateCreateEdit;
}

export const getDataTypesCount = (template: ReportTemplate) => {
  return new Set(template.fields.map(field => field.dataTypeId)).size;
}
