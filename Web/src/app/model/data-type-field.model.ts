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
  Number = 3,
  Text = 4
}

export const fieldTypes = [
  {label: 'Check', value: FieldType.Check},
  {label: 'Date', value: FieldType.Date},
  {label: 'Number', value: FieldType.Number},
  {label: 'Text', value: FieldType.Text}
];

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
  dataTypeFieldId: number;
  isRequired: boolean;
  name: string;
  type: FieldType;
}
