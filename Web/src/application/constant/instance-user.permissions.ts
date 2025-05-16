export const InstanceUserPermissions = {
  customer: {
    create: 'customer/create',
    preview: 'customer/preview',
    edit: 'customer/edit',
    delete: 'customer/delete',
  },
  dataEntry: {
    create: 'dataEntry/create',
    preview: 'dataEntry/preview',
    edit: 'dataEntry/edit',
    delete: 'dataEntry/delete',
  },
  dataType: {
    create: 'dataType/create',
    preview: 'dataType/preview',
    edit: 'dataType/edit',
    delete: 'dataType/delete',
  },
  importConfiguration: {
    create: 'importConfiguration/create',
    preview: 'importConfiguration/preview',
    edit: 'importConfiguration/edit',
    delete: 'importConfiguration/delete',
  },
  instance: {
    edit: 'instance/edit',
  },
  reportTemplate: {
    create: 'reportTemplate/create',
    preview: 'reportTemplate/preview',
    edit: 'reportTemplate/edit',
    delete: 'reportTemplate/delete',
  },
  report: {
    create: 'report/create',
  },
  sale: {
    create: 'sale/create',
    preview: 'sale/preview',
    edit: 'sale/edit',
    delete: 'sale/delete',
  },
  salesman: {
    create: 'salesman/create',
    preview: 'salesman/preview',
    edit: 'salesman/edit',
    delete: 'salesman/delete',
  },
  vatReturn: {
    create: 'vatReturn/create',
    preview: 'vatReturn/preview',
    submitPayment: 'vatReturn/submitPayment',
    cancel: 'vatReturn/delete'
  }
};

export const instanceUserPermissions = [
  { label: 'misc.instance.permission.customer.create', value: InstanceUserPermissions.customer.create },
  { label: 'misc.instance.permission.customer.preview', value: InstanceUserPermissions.customer.preview },
  { label: 'misc.instance.permission.customer.edit', value: InstanceUserPermissions.customer.edit },
  { label: 'misc.instance.permission.customer.delete', value: InstanceUserPermissions.customer.delete },
  { label: 'misc.instance.permission.data-entry.create', value: InstanceUserPermissions.dataEntry.create },
  { label: 'misc.instance.permission.data-entry.preview', value: InstanceUserPermissions.dataEntry.preview },
  { label: 'misc.instance.permission.data-entry.edit', value: InstanceUserPermissions.dataEntry.edit },
  { label: 'misc.instance.permission.data-entry.delete', value: InstanceUserPermissions.dataEntry.delete },
  { label: 'misc.instance.permission.data-type.create', value: InstanceUserPermissions.dataType.create },
  { label: 'misc.instance.permission.data-type.preview', value: InstanceUserPermissions.dataType.preview },
  { label: 'misc.instance.permission.data-type.edit', value: InstanceUserPermissions.dataType.edit },
  { label: 'misc.instance.permission.data-type.delete', value: InstanceUserPermissions.dataType.delete },
  { label: 'misc.instance.permission.import-configuration.create', value: InstanceUserPermissions.importConfiguration.create },
  { label: 'misc.instance.permission.import-configuration.preview', value: InstanceUserPermissions.importConfiguration.preview },
  { label: 'misc.instance.permission.import-configuration.edit', value: InstanceUserPermissions.importConfiguration.edit },
  { label: 'misc.instance.permission.import-configuration.delete', value: InstanceUserPermissions.importConfiguration.delete },
  { label: 'misc.instance.permission.instance.edit', value: InstanceUserPermissions.instance.edit },
  { label: 'misc.instance.permission.report-template.create', value: InstanceUserPermissions.reportTemplate.create },
  { label: 'misc.instance.permission.report-template.preview', value: InstanceUserPermissions.reportTemplate.preview },
  { label: 'misc.instance.permission.report-template.edit', value: InstanceUserPermissions.reportTemplate.edit },
  { label: 'misc.instance.permission.report-template.delete', value: InstanceUserPermissions.reportTemplate.delete },
  { label: 'misc.instance.permission.report.create', value: InstanceUserPermissions.report.create },
  { label: 'misc.instance.permission.sale.create', value: InstanceUserPermissions.sale.create },
  { label: 'misc.instance.permission.sale.preview', value: InstanceUserPermissions.sale.preview },
  { label: 'misc.instance.permission.sale.edit', value: InstanceUserPermissions.sale.edit },
  { label: 'misc.instance.permission.sale.delete', value: InstanceUserPermissions.sale.delete },
  { label: 'misc.instance.permission.salesman.create', value: InstanceUserPermissions.salesman.create },
  { label: 'misc.instance.permission.salesman.preview', value: InstanceUserPermissions.salesman.preview },
  { label: 'misc.instance.permission.salesman.edit', value: InstanceUserPermissions.salesman.edit },
  { label: 'misc.instance.permission.salesman.delete', value: InstanceUserPermissions.salesman.delete },
  { label: 'misc.instance.permission.vat-return.create', value: InstanceUserPermissions.vatReturn.create },
  { label: 'misc.instance.permission.vat-return.preview', value: InstanceUserPermissions.vatReturn.preview },
  { label: 'misc.instance.permission.vat-return.submit-payment', value: InstanceUserPermissions.vatReturn.submitPayment },
  { label: 'misc.instance.permission.vat-return.cancel', value: InstanceUserPermissions.vatReturn.cancel }
];
