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
    /// <summary>
    /// Configures the certificate for the application.
    /// </summary>
    /// <param name="builder">To configure certificate for</param>
    /// <exception cref="FileNotFoundException">Thrown if certificate path is invalid</exception>
    public static void AddCertificate(this WebApplicationBuilder builder)
    {
        builder.WebHost.ConfigureKestrel(
            kestrel =>
            {
                kestrel.ConfigureHttpsDefaults(
                    https =>
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

    /// <summary>
    /// Binds a configuration section to a configuration object and registers it as a singleton.
    /// </summary>
    /// <param name="builder">To bind configuration for</param>
    /// <param name="section">To bind onto configuration</param>
    /// <typeparam name="TConfiguration">Configuration class type</typeparam>
    /// <returns>Configuration instance</returns>
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

    /// <summary>
    /// Adds a database context to the service collection.
    /// </summary>
    /// <param name="services">To add database context to</param>
    /// <param name="databaseOptions">Configuration of database</param>
    /// <exception cref="NotSupportedException">If unsupported database dialect is used</exception>
    public static void AddDbContext(
        this IServiceCollection services,
        DatabaseOptions databaseOptions
    )
    {
        services.AddDbContext<AccountingDatabase>(
            optionsBuilder =>
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
                    mySqlOptionsBuilder => mySqlOptionsBuilder.EnableStringComparisonTranslations()
                );
            }
        );
    }

    /// <summary>
    /// Adds JWT authentication and authorization to the application.
    /// </summary>
    /// <param name="builder">Builder to use for setting up authentication, authorization</param>
    /// <exception cref="InvalidConfigurationException">Thrown if JwtSettings:Secret configuration is not set</exception>
    public static void AddJwtAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<IAuthorizationHandler, CustomerAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, SaleAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, SalesmanAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, UserAuthorizationHandler>();
        builder.Services.AddScoped<IAuthorizationHandler, VatReturnAuthorizationHandler>();

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

    /// <summary>
    /// Maps the API endpoints.
    /// </summary>
    /// <param name="application">Application to map endpoints in</param>
    public static void MapEndpoints(this WebApplication application)
    {
        var apiRouteGroup = application
            .MapGroup("/api/v1")
            .RequireAuthorization();

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
            .MapGroup("/instance")
            .MapInstanceEndpoints();

        accountingRouteGroup
            .MapGroup("/instance-user-meta")
            .MapInstanceMetaEndpoints();

        var stiRouteGroup = accountingRouteGroup
            .MapGroup("/sti");

        stiRouteGroup.MapStiEndpoints();

        stiRouteGroup
            .MapGroup("/vat-return")
            .MapVatReturnEndpoints();
    }
}