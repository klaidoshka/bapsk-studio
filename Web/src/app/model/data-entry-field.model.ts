export default interface DataEntryField {
  dataEntryId: number;
  dataTypeFieldId: number;
  id: number;
  name: string;
  value: string;
}

export interface DataEntryFieldCreateRequest {
  dataEntryId: number;
  dataTypeFieldId: number;
  value: string;
}

export interface DataEntryFieldEditRequest {
  dataEntryFieldId: number;
  value: string;
}
