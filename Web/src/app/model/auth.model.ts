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
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
