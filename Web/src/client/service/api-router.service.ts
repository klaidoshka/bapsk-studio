import {Injectable} from '@angular/core';

const buildRoute = (template: string, parameters: Record<string, string | number> = {}) =>
  template.replace(/:([a-zA-Z]+)/g, (_, key) => encodeURIComponent(parameters[key]));

const buildUrl = (
  base: string,
  routeTemplate: string,
  routeParameters?: Record<string, string | number>,
  queryParameters?: Record<string, string | number | boolean>
) => {
  const route = buildRoute(routeTemplate, routeParameters);
  const url = new URL(base + route);

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
  private readonly base = 'http://localhost:5125/api/v1';
  private readonly accounting = this.base + '/accounting';

  readonly auth = {
    changePassword: () => buildUrl(this.base, '/auth/change-password'),
    login: () => buildUrl(this.base, '/auth/login'),
    logout: () => buildUrl(this.base, '/auth/logout'),
    refresh: () => buildUrl(this.base, '/auth/refresh'),
    register: () => buildUrl(this.base, '/auth/register'),
    resetPassword: () => buildUrl(this.base, '/auth/reset-password'),
  };

  readonly customer = {
    create: () => buildUrl(this.accounting, '/customer'),
    delete: (id: number) => buildUrl(this.accounting, '/customer/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/customer/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/customer/:id', { id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accounting, '/customer', {}, { instanceId }),
  };

  readonly dataEntry = {
    create: () => buildUrl(this.accounting, '/data-entry'),
    delete: (id: number) => buildUrl(this.accounting, '/data-entry/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/data-entry/:id', { id }),
    getByDataTypeId: (dataTypeId: number) => buildUrl(this.accounting, '/data-entry', {}, { dataTypeId }),
    getById: (id: number) => buildUrl(this.accounting, '/data-entry/:id', { id }),
    import: () => buildUrl(this.accounting, '/data-entry/import'),
  };

  readonly dataType = {
    create: () => buildUrl(this.accounting, '/data-type'),
    delete: (id: number) => buildUrl(this.accounting, '/data-type/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/data-type/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/data-type/:id', { id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accounting, '/data-type', {}, { instanceId }),
  };

  readonly importConfiguration = {
    create: () => buildUrl(this.accounting, '/import-configuration'),
    delete: (id: number) => buildUrl(this.accounting, '/import-configuration/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/import-configuration/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/import-configuration/:id', { id }),
    getByDataTypeId: (dataTypeId: number) => buildUrl(this.accounting, '/import-configuration', {}, { dataTypeId }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accounting, '/import-configuration', {}, { instanceId }),
  };

  readonly instance = {
    create: () => buildUrl(this.accounting, '/instance'),
    delete: (id: number) => buildUrl(this.accounting, '/instance/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/instance/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/instance/:id', { id }),
    getByUser: () => buildUrl(this.accounting, '/instance'),
  };

  readonly report = {
    generateDataEntries: () => buildUrl(this.accounting, '/report/generate-data-entries'),
    generateSales: () => buildUrl(this.accounting, '/report/generate-sales'),
  };

  readonly reportTemplate = {
    create: () => buildUrl(this.accounting, '/report-template'),
    delete: (id: number) => buildUrl(this.accounting, '/report-template/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/report-template/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/report-template/:id', { id }),
    getByInstanceId: (id: number) => buildUrl(this.accounting, '/report-template', {}, { instanceId: id }),
  };

  readonly sale = {
    create: () => buildUrl(this.accounting, '/sale'),
    delete: (id: number) => buildUrl(this.accounting, '/sale/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/sale/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/sale/:id', { id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accounting, '/sale', {}, { instanceId }),
  };

  readonly salesman = {
    create: () => buildUrl(this.accounting, '/salesman'),
    delete: (id: number) => buildUrl(this.accounting, '/salesman/:id', { id }),
    edit: (id: number) => buildUrl(this.accounting, '/salesman/:id', { id }),
    getById: (id: number) => buildUrl(this.accounting, '/salesman/:id', { id }),
    getByInstanceId: (instanceId: number) => buildUrl(this.accounting, '/salesman', {}, { instanceId }),
  };

  readonly session = {
    getByUser: () => buildUrl(this.base, '/session'),
    revoke: (id: string) => buildUrl(this.base, '/session/:id', { id }),
  };

  readonly user = {
    create: () => buildUrl(this.base, '/user'),
    delete: (id: number) => buildUrl(this.base, '/user/:id', { id }),
    edit: (id: number) => buildUrl(this.base, '/user/:id', { id }),
    get: (returnIdentityOnly = false) => buildUrl(this.base, '/user', {}, { returnIdentityOnly }),
    getByEmail: (email: string, returnIdentityOnly = false) => buildUrl(this.base, '/user', {}, { email, returnIdentityOnly }),
    getById: (id: number, returnIdentityOnly = false) => buildUrl(this.base, '/user/:id', { id }, { returnIdentityOnly }),
  };

  readonly vatReturn = {
    cancel: (saleId: number) => buildUrl(this.accounting, '/sti/vat-return/:saleId/cancel', { saleId }),
    submit: () => buildUrl(this.accounting, '/sti/vat-return'),
    getBySaleId: (saleId: number) => buildUrl(this.accounting, '/sti/vat-return/:saleId', { saleId }),
    getByCode: (code: string) => buildUrl(this.accounting, '/sti/vat-return', {}, { code }),
    payment: (saleId: number) => buildUrl(this.accounting, '/sti/vat-return/:saleId/payment', { saleId }),
    update: (saleId: number) => buildUrl(this.accounting, '/sti/vat-return/:saleId/update', { saleId }),
    updateByCode: (code: string) => buildUrl(this.accounting, '/sti/vat-return/update', {}, { code }),
  };
}
