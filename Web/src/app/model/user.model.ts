import {Role} from './role.model';
import {IsoCountryCode} from './iso-country.model';

export interface User {
  birthDate: Date;
  country: IsoCountryCode;
  email: string;
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UserIdentity {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UserCreateRequest {
  birthDate: Date;
  country: IsoCountryCode;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserEditRequest {
  birthDate: Date;
  country: IsoCountryCode;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
}

export const toUserIdentity = (user: User): UserIdentity => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName
  };
}

export const toUserFullName = (user?: User) => {
  if (user == null) {
    return '';
  }

  return `${user.firstName} ${user.lastName}`;
}
export const toUserIdentityFullName = (userIdentity?: UserIdentity) => {
  if (userIdentity == null) {
    return '';
  }
  return `${userIdentity.firstName} ${userIdentity.lastName}`;
}
