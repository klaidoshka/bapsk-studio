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

  public readonly dataEntryFieldCreate = () => `${this.accountingUrl}/data-entry-field`;
  public readonly dataEntryFieldDelete = (id: number) => `${this.accountingUrl}/data-entry-field/${id}`;
  public readonly dataEntryFieldEdit = (id: number) => `${this.accountingUrl}/data-entry-field/${id}`;
  public readonly dataEntryFieldGet = (id: number) => `${this.accountingUrl}/data-entry-field/${id}`;
  public readonly dataEntryFieldGetByDataEntryId = (dataEntryId: number) => `${this.accountingUrl}/data-entry-field?dataEntryId=${dataEntryId}`;

  public readonly dataTypeCreate = () => `${this.accountingUrl}/data-type`;
  public readonly dataTypeDelete = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeEdit = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeGet = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeGetByInstanceId = (instanceId: number) => `${this.accountingUrl}/data-type?instanceId=${instanceId}`;

  public readonly dataTypeFieldCreate = () => `${this.accountingUrl}/data-type-field`;
  public readonly dataTypeFieldDelete = (id: number) => `${this.accountingUrl}/data-type-field/${id}`;
  public readonly dataTypeFieldEdit = (id: number) => `${this.accountingUrl}/data-type-field/${id}`;
  public readonly dataTypeFieldGet = (id: number) => `${this.accountingUrl}/data-type-field/${id}`;
  public readonly dataTypeFieldGetByDataTypeId = (dataTypeId: number) => `${this.accountingUrl}/data-type-field?dataTypeId=${dataTypeId}`;

  public readonly instanceCreate = () => `${this.accountingUrl}/instance`;
  public readonly instanceDelete = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceEdit = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceGet = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceGetByUserId = (userId: number) => `${this.accountingUrl}/instance?userId=${userId}`;

  public readonly instanceUserMetaCreate = () => `${this.accountingUrl}/instance-user-meta`;
  public readonly instanceUserMetaDelete = (id: number) => `${this.accountingUrl}/instance-user-meta/${id}`;
  public readonly instanceUserMetaEdit = (id: number) => `${this.accountingUrl}/instance-user-meta/${id}`;
  public readonly instanceUserMetaGet = (id: number) => `${this.accountingUrl}/instance-user-meta/${id}`;
  public readonly instanceUserMetaGetByInstanceId = (instanceId: number) => `${this.accountingUrl}/instance-user-meta?instanceId=${instanceId}`;

  public readonly sessionGetByUserId = (userId: number) => `${this.baseServerUrl}/session?userId=${userId}`;
}
