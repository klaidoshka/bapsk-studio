export default interface Instance {
  id: number | null;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface InstanceCreateRequest {
  name: string;
  description: string | null;
}

export interface InstanceEditRequest {
  instanceId: number;
  name: string;
  description: string | null;
}
