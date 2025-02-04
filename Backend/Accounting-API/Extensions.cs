namespace Accounting.API;

public static class Extensions
{
    /// <summary>
    /// Binds a configuration section to a configuration object and registers it as a singleton.
    /// </summary>
    /// <param name="builder">to bind configuration in</param>
    /// <param name="section">to bind onto configuration</param>
    /// <param name="configuration">to register as singleton</param>
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
}