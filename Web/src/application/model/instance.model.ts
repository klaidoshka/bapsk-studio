import {User} from './user.model';

export default interface Instance {
  createdAt: Date;
  createdById: number;
  description: string | null;
  id?: number;
  name: string;
  users: InstanceUser[];
}

export interface InstanceWithUsers {
  createdAt: Date;
  createdById: number;
  description: string | null;
  id?: number;
  name: string;
  users: InstanceUserWithUser[];
}

export interface InstanceUser {
  id: number;
  instanceId: number;
  permissions: string[];
  userId: number;
}

export interface InstanceUserCreateEdit {
  userId: number;
  permissions: string[];
}

export interface InstanceUserWithUser extends InstanceUser {
  user: User;
}

export interface InstanceCreateRequest {
  description: string | null;
  name: string;
  users: InstanceUserCreateEdit[];
}

export interface InstanceEditRequest {
  description: string | null;
  instanceId: number;
  name: string;
  users: InstanceUserCreateEdit[];
}
