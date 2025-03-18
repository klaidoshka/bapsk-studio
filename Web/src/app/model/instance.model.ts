import {User} from './user.model';

export default interface Instance {
  createdAt: Date;
  createdById: number;
  description: string | null;
  id?: number;
  name: string;
  userMetas: InstanceUserMeta[];
}

export interface InstanceWithUsers {
  createdAt: Date;
  createdById: number;
  description: string | null;
  id?: number;
  name: string;
  userMetas: InstanceUserMetaWithUser[];
}

export interface InstanceUserMeta {
  id: number;
  instanceId: number;
  userId: number;
}

export interface InstanceUserMetaCreateEdit {
  userId: number;
}

export interface InstanceUserMetaWithUser extends InstanceUserMeta {
  user: User;
}

export interface InstanceCreateRequest {
  description: string | null;
  name: string;
  userMetas: InstanceUserMetaCreateEdit[];
}

export interface InstanceEditRequest {
  description: string | null;
  instanceId: number;
  name: string;
  userMetas: InstanceUserMetaCreateEdit[];
}
