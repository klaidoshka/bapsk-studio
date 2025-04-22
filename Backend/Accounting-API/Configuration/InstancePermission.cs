namespace Accounting.API.Configuration;

public static class InstancePermission
{
    public static class Customer
    {
        public static readonly string Create = "customer/create";
        public static readonly string Preview = "customer/preview";
        public static readonly string Edit = "customer/edit";
        public static readonly string Delete = "customer/delete";
    }

    public static class DataEntry
    {
        public static readonly string Create = "dataEntry/create";
        public static readonly string Preview = "dataEntry/preview";
        public static readonly string Edit = "dataEntry/edit";
        public static readonly string Delete = "dataEntry/delete";
    }

    public static class DataType
    {
        public static readonly string Create = "dataType/create";
        public static readonly string Preview = "dataType/preview";
        public static readonly string Edit = "dataType/edit";
        public static readonly string Delete = "dataType/delete";
    }

    public static class ImportConfiguration
    {
        public static readonly string Create = "importConfiguration/create";
        public static readonly string Preview = "importConfiguration/preview";
        public static readonly string Edit = "importConfiguration/edit";
        public static readonly string Delete = "importConfiguration/delete";
    }

    public static class Instance
    {
        public static readonly string Edit = "instance/edit";
    }

    public static class Report
    {
        public static readonly string Create = "report/create";
    }

    public static class ReportTemplate
    {
        public static readonly string Create = "reportTemplate/create";
        public static readonly string Preview = "reportTemplate/preview";
        public static readonly string Edit = "reportTemplate/edit";
        public static readonly string Delete = "reportTemplate/delete";
    }

    public static class Sale
    {
        public static readonly string Create = "sale/create";
        public static readonly string Preview = "sale/preview";
        public static readonly string Edit = "sale/edit";
        public static readonly string Delete = "sale/delete";
    }

    public static class Salesman
    {
        public static readonly string Create = "salesman/create";
        public static readonly string Preview = "salesman/preview";
        public static readonly string Edit = "salesman/edit";
        public static readonly string Delete = "salesman/delete";
    }

    public static class VatReturn
    {
        public static readonly string Create = "vatReturn/create";
        public static readonly string Preview = "vatReturn/preview";
        public static readonly string SubmitPayment = "vatReturn/submitPayment";
        public static readonly string Cancel = "vatReturn/delete";
    }
}