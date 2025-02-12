export default interface DataEntry {
  createdAt: Date;
  createdById: number;
  dataTypeId: number;
  id: number;
  modifiedAt?: Date;
  modifiedById?: number;
}

export interface CreateRequest {
  dataTypeId: number;
  values: Map<number, object>;
}

export interface EditRequest {
  id: number;
  values: Map<number, object>;
}
