import DataType from "./data-type.model";

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

export interface ImportConfigurationJoined extends ImportConfiguration {
  dataType: DataType;
}

export interface ImportConfigurationCreateRequest {
  importConfiguration: ImportConfiguration;
  instanceId: number;
}

export interface ImportConfigurationEditRequest {
  importConfiguration: ImportConfiguration;
  instanceId: number;
}
