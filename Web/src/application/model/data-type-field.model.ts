export default interface DataTypeField {
  dataTypeId: number;
  defaultValue?: any;
  id: number;
  isRequired: boolean;
  name: string;
  referenceId?: number | null;
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
  {label: 'misc.field-type.check', value: FieldType.Check},
  {label: 'misc.field-type.date', value: FieldType.Date},
  {label: 'misc.field-type.number', value: FieldType.Number},
  {label: 'misc.field-type.text', value: FieldType.Text},
  {label: 'misc.field-type.reference', value: FieldType.Reference},
  {label: 'misc.field-type.country', value: FieldType.IsoCountryCode},
  {label: 'misc.field-type.currency', value: FieldType.Currency}
].sort((a, b) => a.label.localeCompare(b.label));

export const toFieldTypeLabel = (type: FieldType): string => {
  const label = fieldTypes.find(it => it.value === type)?.label;

  if (!label) {
    throw new Error(`Field type ${type} not found while searching label`);
  }

  return label;
}

export interface DataTypeFieldCreateRequest {
  defaultValue: any;
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
