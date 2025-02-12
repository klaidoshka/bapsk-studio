export default interface DataType {
  description: string | null;
  id: number;
  instanceId: number;
  name: string;
}

export interface DataTypeCreateRequest {
  description: string | null;
  instanceId: number;
  name: string;
}

export interface DataTypeEditRequest {
  description: string | null;
  id: number;
  name: string;
}
