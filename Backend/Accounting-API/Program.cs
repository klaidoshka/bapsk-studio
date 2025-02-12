using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.API.Middleware;
using Accounting.API.Util;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Service;
using Accounting.Services.Validator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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
builder.Services.AddScoped<IDataEntryFieldService, DataEntryFieldService>();
builder.Services.AddScoped<IDataEntryService, DataEntryService>();
builder.Services.AddScoped<IDataTypeFieldService, DataTypeFieldService>();
builder.Services.AddScoped<IDataTypeService, DataTypeService>();
builder.Services.AddScoped<IFieldTypeService, FieldTypeService>();
builder.Services.AddScoped<IHashService, HashService>();
builder.Services.AddScoped<IInstanceService, InstanceService>();
builder.Services.AddScoped<IInstanceUserMetaService, InstanceUserMetaService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IStiService, StiService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ExceptionHandlingMiddleware>();

builder.Services
    .AddAuthentication(
        options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }
    )
    .AddJwtBearer(
        options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                ValidAudience = builder.Configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"])
                )
            };
        }
    );

builder.Services.AddAuthorization();
builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(
    json =>
    {
        json.SerializerOptions.PropertyNameCaseInsensitive = true;
        json.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    }
);

var application = builder.Build();

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