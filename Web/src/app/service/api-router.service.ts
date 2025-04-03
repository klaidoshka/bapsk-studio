import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiRouter {
  private readonly baseServerUrl = 'http://localhost:5125/api/v1';
  private readonly accountingUrl = this.baseServerUrl + '/accounting';

  public readonly toParameters = (parameters: { [key: string]: string | number | boolean }) => {
    let params = new HttpParams();

    Object.keys(parameters).forEach(key => {
      params = params.set(key, parameters[key]);
    });

    return params.toString();
  }

  public readonly authLogin = () => `${this.baseServerUrl}/auth/login`;
  public readonly authLogout = () => `${this.baseServerUrl}/auth/logout`;
  public readonly authRefresh = () => `${this.baseServerUrl}/auth/refresh`;
  public readonly authRegister = () => `${this.baseServerUrl}/auth/register`;

  public readonly customerCreate = () => `${this.accountingUrl}/customer`;
  public readonly customerDelete = (id: number) => `${this.accountingUrl}/customer/${id}`;
  public readonly customerEdit = (id: number) => `${this.accountingUrl}/customer/${id}`;
  public readonly customerGet = (instanceId: number) => `${this.accountingUrl}/customer?${this.toParameters({
    instanceId: instanceId
  })}`;
  public readonly customerGetById = (id: number) => `${this.accountingUrl}/customer/${id}`;

  public readonly dataEntryCreate = () => `${this.accountingUrl}/data-entry`;
  public readonly dataEntryDelete = (id: number) => `${this.accountingUrl}/data-entry/${id}`;
  public readonly dataEntryEdit = (id: number) => `${this.accountingUrl}/data-entry/${id}`;
  public readonly dataEntryGetById = (id: number) => `${this.accountingUrl}/data-entry/${id}`;
  public readonly dataEntryGetByDataTypeId = (dataTypeId: number) => `${this.accountingUrl}/data-entry?${this.toParameters({
    dataTypeId: dataTypeId
  })}`;

  public readonly dataTypeCreate = () => `${this.accountingUrl}/data-type`;
  public readonly dataTypeDelete = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeEdit = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeGetById = (id: number) => `${this.accountingUrl}/data-type/${id}`;
  public readonly dataTypeGetByInstanceId = (instanceId: number) =>
    `${this.accountingUrl}/data-type?${this.toParameters({
      instanceId: instanceId
    })}`;

  public readonly instanceCreate = () => `${this.accountingUrl}/instance`;
  public readonly instanceDelete = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceEdit = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceGetById = (id: number) => `${this.accountingUrl}/instance/${id}`;
  public readonly instanceGetByUser = () => `${this.accountingUrl}/instance`;

  public readonly saleCreate = () => `${this.accountingUrl}/sale`;
  public readonly saleDelete = (id: number) => `${this.accountingUrl}/sale/${id}`;
  public readonly saleEdit = (id: number) => `${this.accountingUrl}/sale/${id}`;
  public readonly saleGet = (instanceId: number) => `${this.accountingUrl}/sale?${this.toParameters({
    instanceId: instanceId
  })}`;
  public readonly saleGetById = (id: number) => `${this.accountingUrl}/sale/${id}`;

  public readonly salesmanCreate = () => `${this.accountingUrl}/salesman`;
  public readonly salesmanDelete = (id: number) => `${this.accountingUrl}/salesman/${id}`;
  public readonly salesmanEdit = (id: number) => `${this.accountingUrl}/salesman/${id}`;
  public readonly salesmanGet = (instanceId: number) => `${this.accountingUrl}/salesman?${this.toParameters({
    instanceId: instanceId
  })}`;
  public readonly salesmanGetById = (id: number) => `${this.accountingUrl}/salesman/${id}`;

  public readonly sessionGetByUser = () => `${this.baseServerUrl}/session`;
  public readonly sessionRevoke = (id: string) => `${this.baseServerUrl}/session/${id}`;

  public readonly userCreate = () => `${this.baseServerUrl}/user`;
  public readonly userDelete = (id: number) => `${this.baseServerUrl}/user/${id}`;
  public readonly userEdit = (id: number) => `${this.baseServerUrl}/user/${id}`;
  public readonly userGet = (returnIdentityOnly: boolean = false) =>
    `${this.baseServerUrl}/user?${this.toParameters({
      returnIdentityOnly: returnIdentityOnly
    })}`
  public readonly userGetById = (id: number, returnIdentityOnly: boolean = false) =>
    `${this.baseServerUrl}/user/${id}?${this.toParameters({
      returnIdentityOnly: returnIdentityOnly
    })}`
  public readonly userGetByEmail = (email: string, returnIdentityOnly: boolean = false) =>
    `${this.baseServerUrl}/user?${this.toParameters({
      email: email,
      returnIdentityOnly: returnIdentityOnly
    })}`

  public readonly vatReturnSubmit = () => `${this.accountingUrl}/sti/vat-return`;
  public readonly vatReturnGet = (saleId: number) => `${this.accountingUrl}/sti/vat-return/${saleId}`;
  public readonly vatReturnGetByPreviewCode = (code: string) => `${this.accountingUrl}/sti/vat-return?${this.toParameters({
    code: code
  })}`;
}
