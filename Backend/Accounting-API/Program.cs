using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.API.Middleware;
using Accounting.API.Util;
using Accounting.Contract.Configuration;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.FieldHandler;
using Accounting.Services.Service;
using Accounting.Services.Validator;

var builder = WebApplication.CreateBuilder(args);

builder.AddConfiguration<Butenta>("Butenta");
builder.AddConfiguration<Email>("Email");
builder.AddConfiguration<JwtSettings>("JwtSettings");
builder.AddConfiguration<Logging>("Logging");
builder.AddConfiguration<StiVatReturn>("StiVatReturn");

builder.AddCertificate();

var databaseOptions = builder.AddConfiguration<DatabaseOptions>("DatabaseOptions");

builder.Services.AddDbContext(databaseOptions);
builder.Services.AddSingleton<ExceptionHandlingMiddleware>();
builder.Services.AddSingleton<JwtExtractorMiddleware>();
builder.Services.AddScoped<CheckFieldHandler>();
builder.Services.AddScoped<CurrencyFieldHandler>();
builder.Services.AddScoped<DateFieldHandler>();
builder.Services.AddScoped<IsoCountryCodeFieldHandler>();
builder.Services.AddScoped<NumberFieldHandler>();
builder.Services.AddScoped<ReferenceFieldHandler>();
builder.Services.AddScoped<TextFieldHandler>();

builder.Services.AddScoped<Dictionary<FieldType, FieldHandler>>(provider => new()
    {
        [FieldType.Check] = provider.GetRequiredService<CheckFieldHandler>(),
        [FieldType.Currency] = provider.GetRequiredService<CurrencyFieldHandler>(),
        [FieldType.Date] = provider.GetRequiredService<DateFieldHandler>(),
        [FieldType.IsoCountryCode] = provider.GetRequiredService<IsoCountryCodeFieldHandler>(),
        [FieldType.Number] = provider.GetRequiredService<NumberFieldHandler>(),
        [FieldType.Reference] = provider.GetRequiredService<ReferenceFieldHandler>(),
        [FieldType.Text] = provider.GetRequiredService<TextFieldHandler>()
    }
);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthValidator, AuthValidator>();
builder.Services.AddScoped<IButentaService, ButentaService>();
builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<ICsvService, CsvService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ICustomerValidator, CustomerValidator>();
builder.Services.AddScoped<IDataEntryService, DataEntryService>();
builder.Services.AddScoped<IDataEntryValidator, DataEntryValidator>();
builder.Services.AddScoped<IDataTypeService, DataTypeService>();
builder.Services.AddScoped<IDataTypeValidator, DataTypeValidator>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEncryptService, EncryptService>();
builder.Services.AddScoped<IFieldTypeService, FieldTypeService>();
builder.Services.AddScoped<IFieldTypeValidator, FieldTypeValidator>();
builder.Services.AddScoped<IHashService, HashService>();
builder.Services.AddScoped<IImportConfigurationService, ImportConfigurationService>();
builder.Services.AddScoped<IImportConfigurationValidator, ImportConfigurationValidator>();
builder.Services.AddScoped<IInstanceAuthorizationService, InstanceAuthorizationService>();
builder.Services.AddScoped<IInstanceEntityValidator<Customer>, CustomerValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<DataEntry>, DataEntryValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<DataType>, DataTypeValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<ImportConfiguration>, ImportConfigurationValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<ReportTemplate>, ReportTemplateValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<Salesman>, SalesmanValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<Sale>, SaleValidator>();
builder.Services.AddScoped<IInstanceEntityValidator<StiVatReturnDeclaration>, VatReturnValidator>();
builder.Services.AddScoped<IInstanceService, InstanceService>();
builder.Services.AddScoped<IInstanceValidator, InstanceValidator>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IReportTemplateService, ReportTemplateService>();
builder.Services.AddScoped<IReportTemplateValidator, ReportTemplateValidator>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<ISaleValidator, SaleValidator>();
builder.Services.AddScoped<ISalesmanService, SalesmanService>();
builder.Services.AddScoped<ISalesmanValidator, SalesmanValidator>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ISessionValidator, SessionValidator>();
builder.Services.AddScoped<IStiVatReturnClientService, StiVatReturnClientService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserValidator, UserValidator>();
builder.Services.AddScoped<IVatReturnService, VatReturnService>();
builder.Services.AddScoped<IVatReturnValidator, VatReturnValidator>();

builder.AddJwtAuth();

builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(json =>
    {
        json.SerializerOptions.PropertyNameCaseInsensitive = true;
        json.SerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;

        json.SerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
        );
    }
);

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var application = builder.Build();

application.Use(async (context, next) =>
    {
        context.Request.EnableBuffering();

        await next(context);
    }
);

application.UseAuthentication();
application.UseAuthorization();
application.UseMiddleware<JwtExtractorMiddleware>();
application.UseMiddleware<ExceptionHandlingMiddleware>();
application.MapMinimalApi();

if (application.Environment.IsDevelopment())
{
    application.MapOpenApi();
}

application.UseHttpsRedirection();
application.UseHsts();
application.Run();