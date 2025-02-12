export default interface DataTypeField {
  dataTypeId: number;
  defaultValue: string | null;
  id: number;
  isRequired: boolean;
  name: string;
  type: FieldType;
}

export enum FieldType {
  Check = 1,
  Date = 2,
  Decimal = 3,
  DecimalArray = 4,
  Int = 5,
  IntArray = 6,
  Text = 7,
  TextArray = 8
}

export interface DataTypeFieldCreateRequest {
  dataTypeId: number;
  defaultValue: any;
  instanceId: number;
  isRequired: boolean;
  name: string;
  type: FieldType;
}

export interface DataTypeFieldEditRequest {
  defaultValue: any;
  id: number;
  isRequired: boolean;
  name: string;
  type: FieldType;
}
