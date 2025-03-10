using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.API.Middleware;
using Accounting.API.Util;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Service;
using Accounting.Services.Validator;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.AddConfiguration<CertificateSerialNumbers>("CertificateSerialNumbers");
builder.AddConfiguration<Endpoints>("Endpoints");
builder.AddConfiguration<JwtSettings>("JwtSettings");
builder.AddConfiguration<Logging>("Logging");

var databaseOptions = builder.AddConfiguration<DatabaseOptions>("DatabaseOptions");

builder.AddCertificate();

// Services
builder.Services.AddDbContext(databaseOptions);
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthValidator, AuthValidator>();
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
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ISessionValidator, SessionValidator>();
builder.Services.AddScoped<IStiService, StiService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserValidator, UserValidator>();
builder.Services.AddSingleton<ExceptionHandlingMiddleware>();
builder.Services.AddSingleton<UserIdExtractorMiddleware>();
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