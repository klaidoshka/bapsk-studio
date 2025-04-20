using System.Security.Cryptography.X509Certificates;
using System.Text;
using Accounting.API.AuthorizationHandler;
using Accounting.API.Endpoint;
using Accounting.Contract;
using Accounting.Contract.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Accounting.API.Util;

public static class ProgramExtensions
{
    public static void AddCertificate(this WebApplicationBuilder builder)
    {
        builder.WebHost.ConfigureKestrel(kestrel =>
            {
                kestrel.ConfigureHttpsDefaults(https =>
                    {
                        var path = builder.Configuration["Certificate:Path"];

                        if (!File.Exists(path))
                        {
                            throw new FileNotFoundException("Certificate file not found", path);
                        }

                        https.ServerCertificate = X509CertificateLoader.LoadPkcs12FromFile(
                            path,
                            builder.Configuration["Certificate:Password"]
                        );
                    }
                );
            }
        );
    }

    public static TConfiguration AddConfiguration<TConfiguration>(
        this WebApplicationBuilder builder,
        string section
    )
        where TConfiguration : class
    {
        var configuration = builder.Configuration.GetSection(section).Get<TConfiguration>();

        if (configuration == null)
        {
            throw new InvalidOperationException($"Configuration section {section} is not found.");
        }

        builder.Services.AddSingleton(configuration);

        return configuration;
    }

    public static void AddDbContext(
        this IServiceCollection services,
        DatabaseOptions databaseOptions
    )
    {
        services.AddDbContext<AccountingDatabase>(optionsBuilder =>
            {
                ServerVersion version = databaseOptions.Dialect.ToLowerInvariant() switch
                {
                    "mariadb" => new MariaDbServerVersion(databaseOptions.ServerVersion),
                    "mysql" => new MySqlServerVersion(databaseOptions.ServerVersion),
                    _ => throw new NotSupportedException(
                        $"Dialect {databaseOptions.Dialect} is not supported."
                    )
                };

                optionsBuilder.UseMySql(
                    databaseOptions.ConnectionString,
                    version,
                    mySqlOptionsBuilder => mySqlOptionsBuilder
                        .EnableStringComparisonTranslations()
                        .EnablePrimitiveCollectionsSupport()
                        .TranslateParameterizedCollectionsToConstants()
                );
            }
        );
    }

    public static void AddJwtAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<IAuthorizationHandler, CustomerAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, SaleAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, SalesmanAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, UserAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, VatReturnAuthorizationHandler>();

        builder.Services
            .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                }
            )
            .AddJwtBearer(options =>
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
                            Encoding.UTF8.GetBytes(
                                builder.Configuration["JwtSettings:Secret"] ??
                                throw new InvalidConfigurationException(
                                    "JwtSettings:Secret is not set."
                                )
                            )
                        )
                    };
                }
            );

        builder.Services
            .AddAuthorizationBuilder()
            .AddPolicy(Policies.AdminOnly, policy => policy.RequireRole(Roles.Admin));
    }

    public static void MapMinimalApi(this WebApplication application)
    {
        var apiRouteGroup = application
            .MapGroup("/api/v1")
            .RequireAuthorization()
            .DisableAntiforgery();

        apiRouteGroup
            .MapGroup("/auth")
            .AllowAnonymous()
            .MapAuthEndpoints();

        apiRouteGroup
            .MapGroup("/session")
            .MapSessionEndpoints();

        apiRouteGroup
            .MapGroup("/user")
            .MapUserEndpoints();

        var accountingRouteGroup = apiRouteGroup.MapGroup("/accounting");

        accountingRouteGroup
            .MapGroup("/customer")
            .MapCustomerEndpoints();

        accountingRouteGroup
            .MapGroup("/sale")
            .MapSaleEndpoints();

        accountingRouteGroup
            .MapGroup("/salesman")
            .MapSalesmanEndpoints();

        accountingRouteGroup
            .MapGroup("/data-entry")
            .MapDataEntryEndpoints();

        accountingRouteGroup
            .MapGroup("/data-type")
            .MapDataTypeEndpoints();

        accountingRouteGroup
            .MapGroup("/import-configuration")
            .MapImportConfigurationEndpoints();

        accountingRouteGroup
            .MapGroup("/instance")
            .MapInstanceEndpoints();

        accountingRouteGroup
            .MapGroup("/report")
            .MapReportEndpoints();

        accountingRouteGroup
            .MapGroup("/report-template")
            .MapReportTemplateEndpoints();

        var stiRouteGroup = accountingRouteGroup
            .MapGroup("/sti");

        stiRouteGroup
            .MapGroup("/vat-return")
            .MapVatReturnEndpoints();

        stiRouteGroup
            .MapGroup("/butenta-vat-return")
            .AllowAnonymous()
            .MapButentaEndpoints();
    }
}