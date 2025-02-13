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

export function getFieldTypeLabel(type: FieldType): string {
  const value = fieldTypes.find(
    (fieldType) => fieldType.value === type
  )?.label

  if (!value) {
    throw new Error("Invalid field type");
  }

  return value;
}

export const fieldTypes = [
  {label: 'Check', value: FieldType.Check},
  {label: 'Date', value: FieldType.Date},
  {label: 'Decimal', value: FieldType.Decimal},
  {label: 'DecimalArray', value: FieldType.DecimalArray},
  {label: 'Int', value: FieldType.Int},
  {label: 'IntArray', value: FieldType.IntArray},
  {label: 'Text', value: FieldType.Text},
  {label: 'TextArray', value: FieldType.TextArray}
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
