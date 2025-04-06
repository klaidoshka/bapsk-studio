export default interface DataEntryField {
  dataEntryId: number;
  dataTypeFieldId: number;
  id: number;
  value: string;
}

export interface DataEntryFieldCreateRequest {
  dataTypeFieldId: number;
  value: string;
}

export interface DataEntryFieldEditRequest {
  dataEntryFieldId: number;
  value: string;
}
