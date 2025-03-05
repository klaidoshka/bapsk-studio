import DataTypeField, {
  DataTypeFieldCreateRequest,
  DataTypeFieldEditRequest
} from './data-type-field.model';

export default interface DataType {
  description: string | null;
  fields: DataTypeField[] | null;
  id: number;
  instanceId: number;
  name: string;
  type: DataTypeType;
}

export interface DataTypeCreateRequest {
  description: string | null;
  fields: DataTypeFieldCreateRequest[] | null;
  instanceId: number;
  name: string;
}

export interface DataTypeEditRequest {
  description: string | null;
  dataTypeId: number;
  fields: DataTypeFieldEditRequest[] | null;
  name: string;
}

export enum DataTypeType {
  UserMade = 1,
  Customer = 2,
  Good = 3,
  Sale = 4,
  Salesman = 5
}
