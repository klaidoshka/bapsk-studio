import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

const routePlaceholderRegex = /:([a-zA-Z]+)/g;

const buildRoute = (template: string, parameters: Record<string, string | number> = {}) =>
  template.replace(routePlaceholderRegex, (_, key) => {
    const value = parameters[key];

    if (value === undefined) {
      throw new Error(`Missing route param: ${key}`);
    }

    return encodeURIComponent(value);
  });

const buildUrl = (
  base: string,
  routeTemplate: string,
  routeParameters?: Record<string, string | number>,
  queryParameters?: Record<string, string | number | boolean>
) => {
  const baseUrl = buildRoute(base, routeParameters);
  const routeUrl = buildRoute(routeTemplate, routeParameters);
  const url = new URL(baseUrl + routeUrl);

  if (queryParameters) {
    Object
      .entries(queryParameters)
      .forEach(([key, val]) => url.searchParams.set(key, String(val)));
  }

  return url.toString();
};

@Injectable({
  providedIn: 'root'
})
export class ApiRouter {
  private readonly base = environment.ASPNET__SERVER__API;
  private readonly baseWeb = environment.WEB__SERVER__API;
  private readonly accounting = this.base + '/accounting';
  private readonly accountingIsolated = this.accounting + '/instance/:instanceId';

  readonly auth = {
    changePassword: () => buildUrl(this.base, '/auth/change-password'),
    login: () => buildUrl(this.base, '/auth/login'),
    logout: () => buildUrl(this.base, '/auth/logout'),
    refresh: () => buildUrl(this.base, '/auth/refresh'),
    register: () => buildUrl(this.base, '/auth/register'),
    resetPassword: () => buildUrl(this.base, '/auth/reset-password'),
  };

  readonly customer = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/customer', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/customer/:id', { instanceId, id }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/customer/:id', { instanceId, id }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/customer/:id', { instanceId, id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accountingIsolated, '/customer', { instanceId }),
  };

  readonly dataEntry = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/data-entry', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/data-entry/:id', { instanceId, id }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/data-entry/:id', { instanceId, id }),
    getByDataTypeId: (instanceId: number, dataTypeId: number) =>
      buildUrl(this.accountingIsolated, '/data-entry', { instanceId }, { dataTypeId }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/data-entry/:id', { instanceId, id }),
    import: (instanceId: number) => buildUrl(this.accountingIsolated, '/data-entry/import', { instanceId }),
  };

  readonly dataType = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/data-type', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/data-type/:id', { instanceId, id }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/data-type/:id', { instanceId, id }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/data-type/:id', { instanceId, id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accountingIsolated, '/data-type', { instanceId }),
  };

  readonly importConfiguration = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/import-configuration', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/import-configuration/:id', {
      instanceId,
      id
    }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/import-configuration/:id', {
      instanceId,
      id
    }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/import-configuration/:id', {
      instanceId,
      id
    }),
    getByDataTypeId: (instanceId: number, dataTypeId: number) =>
      buildUrl(this.accountingIsolated, '/import-configuration', { instanceId }, { dataTypeId }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accountingIsolated, '/import-configuration', { instanceId }),
  };

  readonly instance = {
    create: () => buildUrl(this.accounting, '/instance'),
    delete: (id: number) => buildUrl(this.accounting, '/instance/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/instance/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/instance/:id', { id }),
    getByUser: () => buildUrl(this.accounting, '/instance'),
  };

  readonly misc = {
    beautifyHtmlTable: () => buildUrl(this.baseWeb, '/misc/beautify-html-table'),
  }

  readonly report = {
    generateDataEntries: (instanceId: number) =>
      buildUrl(this.accountingIsolated, '/report/generate-data-entries', { instanceId }),
    generateSales: (instanceId: number) =>
      buildUrl(this.accountingIsolated, '/report/generate-sales', { instanceId }),
  };

  readonly reportTemplate = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/report-template', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/report-template/:id', { instanceId, id }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/report-template/:id', { instanceId, id }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/report-template/:id', { instanceId, id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accountingIsolated, '/report-template', { instanceId }),
  };

  readonly sale = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/sale', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/sale/:id', { instanceId, id }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/sale/:id', { instanceId, id }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/sale/:id', { instanceId, id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accountingIsolated, '/sale', { instanceId }),
  };

  readonly salesman = {
    create: (instanceId: number) => buildUrl(this.accountingIsolated, '/salesman', { instanceId }),
    delete: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/salesman/:id', { instanceId, id }),
    edit: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/salesman/:id', { instanceId, id }),
    getById: (instanceId: number, id: number) => buildUrl(this.accountingIsolated, '/salesman/:id', { instanceId, id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accountingIsolated, '/salesman', { instanceId }),
  };

  readonly session = {
    getByUser: () => buildUrl(this.base, '/session'),
    revoke: (id: string) => buildUrl(this.base, '/session/:id', { id }),
  };

  readonly user = {
    create: () => buildUrl(this.base, '/user'),
    delete: (id: number) => buildUrl(this.base, '/user/:id', { id }),
    edit: (id: number) => buildUrl(this.base, '/user/:id', { id }),
    getAll: (returnIdentityOnly = false) => buildUrl(this.base, '/user', {}, { returnIdentityOnly }),
    getByEmail: (email: string, returnIdentityOnly = false) => buildUrl(this.base, '/user', {}, { email, returnIdentityOnly }),
    getById: (id: number, returnIdentityOnly = false) =>
      buildUrl(this.base, '/user/:id', { id }, { returnIdentityOnly }),
  };

  readonly vatReturn = {
    cancel: (instanceId: number, saleId: number) =>
      buildUrl(this.accountingIsolated, '/vat-return/:saleId/cancel', { instanceId, saleId }),
    submit: (instanceId: number) => buildUrl(this.accountingIsolated, '/vat-return', { instanceId }),
    getBySaleId: (instanceId: number, saleId: number) =>
      buildUrl(this.accountingIsolated, '/vat-return/:saleId', { instanceId, saleId }),
    getByCode: (code: string) =>
      buildUrl(this.accounting, '/vat-return', {}, { code }),
    payment: (instanceId: number, saleId: number) =>
      buildUrl(this.accountingIsolated, '/vat-return/:saleId/payment', { instanceId, saleId }),
    update: (instanceId: number, saleId: number) =>
      buildUrl(this.accountingIsolated, '/vat-return/:saleId/update', { instanceId, saleId }),
    updateByCode: (code: string) =>
      buildUrl(this.accounting, '/vat-return/update', {}, { code }),
  };
}
