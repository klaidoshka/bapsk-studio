import DataTypeField, {DataTypeFieldCreateRequest, DataTypeFieldEditRequest} from './data-type-field.model';

export default interface DataType {
  description: string | null;
  fields: DataTypeField[];
  id: number;
  instanceId: number;
  name: string;
}

export interface DataTypeCreateRequest {
  description: string | null;
  fields: DataTypeFieldCreateRequest[];
  instanceId: number;
  name: string;
}

export interface DataTypeEditRequest {
  description: string | null;
  dataTypeId: number;
  fields: DataTypeFieldEditRequest[];
  name: string;
}
