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
  id: number;
  name: string;
  description: string | null;
}
