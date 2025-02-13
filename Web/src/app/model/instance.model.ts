export default interface Instance {
  id: number | null;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateRequest {
  name: string;
  description: string | null;
}

export interface EditRequest {
  instanceId: number;
  name: string;
  description: string | null;
}
