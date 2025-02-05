using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.API;
using Accounting.API.Endpoint;
using Accounting.Contract.Configuration;
using Accounting.Contract.Service;
using Accounting.Contract.Sti;
using Accounting.Services;
using Accounting.Services.Auth;
using Accounting.Services.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.AddConfiguration<CertificateSerialNumbers>("CertificateSerialNumbers");
builder.AddConfiguration<Endpoints>("Endpoints");
builder.AddConfiguration<JwtSettings>("JwtSettings");
builder.AddConfiguration<Logging>("Logging");

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IHashService, HashService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IStiService, StiService>();
builder.Services.AddScoped<IUserService, UserService>();

// Misc
builder.AddCertificate();

builder.Services.AddDbContext<AccountingDatabase>();

builder
    .Services
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

application
    .MapGroup("/api/v1/accounting/sti")
    .MapStiEndpoints();

if (application.Environment.IsDevelopment())
{
    application.MapOpenApi();
}

application.UseHttpsRedirection();

application.UseHsts();

application.Run();