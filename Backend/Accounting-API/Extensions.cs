using System.Security.Cryptography.X509Certificates;

namespace Accounting.API;

public static class Extensions
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="builder"></param>
    public static void AddAuthentication(this WebApplicationBuilder builder)
    {
        
    }
    
    /// <summary>
    /// Binds a configuration section to a configuration object and registers it as a singleton.
    /// </summary>
    /// <param name="builder">To bind configuration for</param>
    /// <param name="section">To bind onto configuration</param>
    /// <param name="configuration">To register as singleton</param>
    /// <typeparam name="TConfiguration">Configuration class type</typeparam>
    public static void BindConfiguration<TConfiguration>(
        this WebApplicationBuilder builder,
        string section,
        TConfiguration configuration
    ) where TConfiguration : class
    {
        builder.Configuration.GetSection(section).Bind(configuration);
        builder.Services.AddSingleton(configuration);
    }

    /// <summary>
    /// Configures the certificate for the application.
    /// </summary>
    /// <param name="builder">To configure certificate for</param>
    /// <exception cref="FileNotFoundException">Thrown if certificate path is invalid</exception>
    public static void ConfigureCertificate(this WebApplicationBuilder builder)
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
            });
        });
    }
}