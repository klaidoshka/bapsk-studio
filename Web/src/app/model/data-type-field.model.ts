export default interface DataTypeField {
  dataTypeId: number;
  defaultValue: string | null;
  id: number;
  isRequired: boolean;
  name: string;
  referenceId: number | null;
  type: FieldType;
}

export enum FieldType {
  Check = 1,
  Date = 2,
  Number = 3,
  Text = 4,
  Reference = 5,
  IsoCountryCode = 6,
  Currency = 7
}

export const fieldTypes = [
  {label: 'Check', value: FieldType.Check},
  {label: 'Date', value: FieldType.Date},
  {label: 'Number', value: FieldType.Number},
  {label: 'Text', value: FieldType.Text},
  {label: 'Reference', value: FieldType.Reference},
  {label: 'Country', value: FieldType.IsoCountryCode},
  {label: 'Currency', value: FieldType.Currency}
].sort((a, b) => a.label.localeCompare(b.label));

export const toFieldTypeLabel = (type: FieldType): string => {
  const label = fieldTypes.find(it => it.value === type)?.label;

  if (!label) {
    throw new Error(`Field type ${type} not found while searching label`);
  }

  return label;
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
  dataTypeFieldId: number;
  isRequired: boolean;
  name: string;
  type: FieldType;
}
