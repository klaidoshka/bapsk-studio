import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiRouter {
  private readonly baseServerUrl = 'http://localhost:5125/api/v1';
  private readonly accountingUrl = this.baseServerUrl + '/accounting';

  public readonly authLogin = () => `${this.baseServerUrl}/auth/login`;
  public readonly authLogout = () => `${this.baseServerUrl}/auth/logout`;
  public readonly authRefresh = () => `${this.baseServerUrl}/auth/refresh`;
  public readonly authRegister = () => `${this.baseServerUrl}/auth/register`;

  public readonly dataEntryCreate = () => `${this.accountingUrl}/data-entry`;
  public readonly dataEntryDelete = (id: number) => `${this.accountingUrl}/data-entry/${id}`;
  public readonly dataEntryEdit = (id: number) => `${this.accountingUrl}/data-entry/${id}`;
  public readonly dataEntryGet = (id: number) => `${this.accountingUrl}/data-entry/${id}`;
  public readonly dataEntryGetByDataTypeId = (dataTypeId: number) => `${this.accountingUrl}/data-entry?dataTypeId=${dataTypeId}`;

  public readonly dataTypeCreate = () => `${this.accountingUrl}/data-type`;
  public readonly dataTypeDelete = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeEdit = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeGet = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeGetByInstanceId = (instanceId: number) => `${this.accountingUrl}/data-type?instanceId=${instanceId}`;

  public readonly instanceCreate = () => `${this.accountingUrl}/instance`;
  public readonly instanceDelete = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceEdit = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceGet = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceGetByUser = () => `${this.accountingUrl}/instance`;

  public readonly sessionGetByUser = () => `${this.baseServerUrl}/session`;
  public readonly sessionRevoke = (id: string) => `${this.baseServerUrl}/session/${id}`;
}
