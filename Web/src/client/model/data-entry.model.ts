import DataEntryField, {DataEntryFieldCreateRequest, DataEntryFieldEditRequest} from './data-entry-field.model';
import {UserIdentity} from './user.model';

export default interface DataEntry {
  createdAt: Date;
  createdById: number;
  dataTypeId: number;
  fields: DataEntryField[];
  id: number;
  modifiedAt: Date;
  modifiedById: number;
}

export interface DataEntryJoined extends DataEntry {
  createdBy: UserIdentity;
  display: () => string;
  modifiedBy: UserIdentity;
}

export interface DataEntryCreateRequest {
  dataTypeId: number;
  fields: DataEntryFieldCreateRequest[];
  instanceId: number;
}

export interface DataEntryEditRequest {
  dataEntryId: number;
  dataTypeId: number;
  fields: DataEntryFieldEditRequest[];
  instanceId: number;
}

export interface DataEntryImportRequest {
  file: File;
  importConfigurationId: number;
  instanceId: number;
  skipHeader: boolean;
}
