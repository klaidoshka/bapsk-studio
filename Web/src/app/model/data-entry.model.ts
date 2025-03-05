import DataEntryField, {
  DataEntryFieldCreateRequest,
  DataEntryFieldEditRequest
} from './data-entry-field.model';

export default interface DataEntry {
  createdAt: Date;
  createdById: number;
  dataTypeId: number;
  fields: DataEntryField[];
  id: number;
  modifiedAt?: Date;
  modifiedById?: number;
}

export interface DataEntryCreateRequest {
  dataTypeId: number;
  fields: DataEntryFieldCreateRequest[];
}

export interface DataEntryEditRequest {
  dataEntryId: number;
  fields: DataEntryFieldEditRequest[];
}
