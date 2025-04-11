export default interface ImportConfiguration {
  dataTypeId: number;
  id: number;
  name: string;
  fields: ImportConfigurationField[];
}

export interface ImportConfigurationField {
  dataTypeFieldId: number;
  defaultValue?: any;
  id: number;
  order: number;
}

export interface ImportConfigurationCreateRequest {
  importConfiguration: ImportConfiguration;
  requesterId: number;
}

export interface ImportConfigurationEditRequest {
  importConfiguration: ImportConfiguration;
  requesterId: number;
}
