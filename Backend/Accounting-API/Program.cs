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

// Configuration
builder.AddConfiguration<JwtSettings>("JwtSettings");
builder.AddConfiguration<Logging>("Logging");
builder.AddConfiguration<StiVatReturn>("StiVatReturn");

var databaseOptions = builder.AddConfiguration<DatabaseOptions>("DatabaseOptions");

builder.AddCertificate();

// Services
builder.Services.AddDbContext(databaseOptions);
builder.Services.AddSingleton<ExceptionHandlingMiddleware>();
builder.Services.AddSingleton<UserIdExtractorMiddleware>();
builder.Services.AddScoped<CheckFieldHandler>();
builder.Services.AddScoped<DateFieldHandler>();
builder.Services.AddScoped<NumberFieldHandler>();
builder.Services.AddScoped<TextFieldHandler>();
builder.Services.AddScoped<ReferenceFieldHandler>();
builder.Services.AddScoped<IsoCountryCodeFieldHandler>();
builder.Services.AddScoped<IdentityDocumentTypeFieldHandler>();
builder.Services.AddScoped<UnitOfMeasureTypeFieldHandler>();

builder.Services.AddScoped<Dictionary<FieldType, FieldHandler>>(
    provider => new Dictionary<FieldType, FieldHandler>
    {
        [FieldType.Check] = provider.GetRequiredService<CheckFieldHandler>(),
        [FieldType.Date] = provider.GetRequiredService<DateFieldHandler>(),
        [FieldType.Number] = provider.GetRequiredService<NumberFieldHandler>(),
        [FieldType.Text] = provider.GetRequiredService<TextFieldHandler>(),
        [FieldType.Reference] = provider.GetRequiredService<ReferenceFieldHandler>(),
        [FieldType.IsoCountryCode] = provider.GetRequiredService<IsoCountryCodeFieldHandler>(),
        [FieldType.IdentityDocumentType] = provider.GetRequiredService<
            IdentityDocumentTypeFieldHandler>(),
        [FieldType.UnitOfMeasureType] = provider.GetRequiredService<UnitOfMeasureTypeFieldHandler>()
    }
);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthValidator, AuthValidator>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IDataEntryService, DataEntryService>();
builder.Services.AddScoped<IDataEntryValidator, DataEntryValidator>();
builder.Services.AddScoped<IDataTypeService, DataTypeService>();
builder.Services.AddScoped<IDataTypeValidator, DataTypeValidator>();
builder.Services.AddScoped<IFieldTypeService, FieldTypeService>();
builder.Services.AddScoped<IFieldTypeValidator, FieldTypeValidator>();
builder.Services.AddScoped<IHashService, HashService>();
builder.Services.AddScoped<IInstanceService, InstanceService>();
builder.Services.AddScoped<IInstanceValidator, InstanceValidator>();
builder.Services.AddScoped<IInstanceUserMetaService, InstanceUserMetaService>();
builder.Services.AddScoped<IInstanceUserMetaValidator, InstanceUserMetaValidator>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<ISalesmanService, SalesmanService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ISessionValidator, SessionValidator>();
builder.Services.AddScoped<IStiVatReturnClientService, StiVatReturnClientService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserValidator, UserValidator>();
builder.Services.AddScoped<IVatReturnService, VatReturnService>();
builder.Services.AddScoped<IVatReturnValidator, VatReturnValidator>();

builder.AddJwtAuth();

builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(
    json =>
    {
        json.SerializerOptions.PropertyNameCaseInsensitive = true;

        json.SerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
        );
    }
);

var application = builder.Build();

application.UseMiddleware<UserIdExtractorMiddleware>();
application.UseAuthentication();
application.UseAuthorization();
application.UseMiddleware<ExceptionHandlingMiddleware>();
application.MapEndpoints();

if (application.Environment.IsDevelopment())
{
    application.MapOpenApi();
}

application.UseHttpsRedirection();
application.UseHsts();
application.Run();