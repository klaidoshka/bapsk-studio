import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiRouter {
  private readonly baseClientServerUrl = 'http://localhost:4200/api/v1';
  private readonly baseServerUrl = 'http://localhost:5125/api/v1';

  public readonly authLogin = () => `${this.baseServerUrl}/auth/login`;
  public readonly authLogout = () => `${this.baseServerUrl}/auth/logout`;
  public readonly authRefresh = () => `${this.baseServerUrl}/auth/refresh`;
  public readonly authRegister = () => `${this.baseServerUrl}/auth/register`;

  public readonly userMetaIp = () => `${this.baseClientServerUrl}/userMeta/ip`;
}
