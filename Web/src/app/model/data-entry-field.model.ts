export default interface DataEntryField {
  dataEntryId: number;
  dataTypeFieldId: number;
  id: number;
  value: any;
}

export interface DataEntryFieldCreateRequest {
  dataTypeFieldId: number;
  value: any;
}

export interface DataEntryFieldEditRequest {
  dataTypeFieldId: number;
  dataEntryFieldId: number;
  value: any;
}
