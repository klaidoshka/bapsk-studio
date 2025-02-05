using System.Security.Cryptography.X509Certificates;

namespace Accounting.API;

public static class Extensions
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
    public static void AddConfiguration<TConfiguration>(this WebApplicationBuilder builder, string section)
        where TConfiguration : class
    {
        builder.Services.AddSingleton(
            builder.Configuration.GetSection(section).Get<TConfiguration>()
        );
    }
}