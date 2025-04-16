import {IsoCountryCode} from './iso-country.model';

export interface AuthResponse {
  accessToken: string;
  sessionId: string;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  birthDate: Date;
  country: IsoCountryCode;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ChangePasswordRequest {
  password: string;
  resetPasswordToken?: string;
}
