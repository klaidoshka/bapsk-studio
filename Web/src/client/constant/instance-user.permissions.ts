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
  { label: 'Authorize to create customers', value: InstanceUserPermissions.customer.create },
  { label: 'Authorize to preview customers', value: InstanceUserPermissions.customer.preview },
  { label: 'Authorize to edit customers', value: InstanceUserPermissions.customer.edit },
  { label: 'Authorize to delete customers', value: InstanceUserPermissions.customer.delete },
  { label: 'Authorize to create data entries', value: InstanceUserPermissions.dataEntry.create },
  { label: 'Authorize to preview data entries', value: InstanceUserPermissions.dataEntry.preview },
  { label: 'Authorize to edit data entries', value: InstanceUserPermissions.dataEntry.edit },
  { label: 'Authorize to delete data entries', value: InstanceUserPermissions.dataEntry.delete },
  { label: 'Authorize to create data types', value: InstanceUserPermissions.dataType.create },
  { label: 'Authorize to preview data types', value: InstanceUserPermissions.dataType.preview },
  { label: 'Authorize to edit data types', value: InstanceUserPermissions.dataType.edit },
  { label: 'Authorize to delete data types', value: InstanceUserPermissions.dataType.delete },
  { label: 'Authorize to create import configurations', value: InstanceUserPermissions.importConfiguration.create },
  { label: 'Authorize to preview import configurations', value: InstanceUserPermissions.importConfiguration.preview },
  { label: 'Authorize to edit import configurations', value: InstanceUserPermissions.importConfiguration.edit },
  { label: 'Authorize to delete import configurations', value: InstanceUserPermissions.importConfiguration.delete },
  { label: 'Authorize to edit instance settings', value: InstanceUserPermissions.instance.edit },
  { label: 'Authorize to create report templates', value: InstanceUserPermissions.reportTemplate.create },
  { label: 'Authorize to preview report templates', value: InstanceUserPermissions.reportTemplate.preview },
  { label: 'Authorize to edit report templates', value: InstanceUserPermissions.reportTemplate.edit },
  { label: 'Authorize to delete report templates', value: InstanceUserPermissions.reportTemplate.delete },
  { label: 'Authorize to generate reports', value: InstanceUserPermissions.report.create },
  { label: 'Authorize to create sales', value: InstanceUserPermissions.sale.create },
  { label: 'Authorize to preview sales', value: InstanceUserPermissions.sale.preview },
  { label: 'Authorize to edit sales', value: InstanceUserPermissions.sale.edit },
  { label: 'Authorize to delete sales', value: InstanceUserPermissions.sale.delete },
  { label: 'Authorize to create salesmen', value: InstanceUserPermissions.salesman.create },
  { label: 'Authorize to preview salesmen', value: InstanceUserPermissions.salesman.preview },
  { label: 'Authorize to edit salesmen', value: InstanceUserPermissions.salesman.edit },
  { label: 'Authorize to delete salesmen', value: InstanceUserPermissions.salesman.delete },
  { label: 'Authorize to create VAT returns', value: InstanceUserPermissions.vatReturn.create },
  { label: 'Authorize to preview VAT returns', value: InstanceUserPermissions.vatReturn.preview },
  { label: 'Authorize to submit payment for VAT returns', value: InstanceUserPermissions.vatReturn.submitPayment },
  { label: 'Authorize to cancel VAT returns', value: InstanceUserPermissions.vatReturn.cancel }
];
