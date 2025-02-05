using System.Text.Json;
using System.Text.Json.Serialization;
using Accounting.API;
using Accounting.API.Endpoint;
using Accounting.Contract.Configuration;
using Accounting.Contract.Sti;
using Accounting.Services;
using Accounting.Services.Sti;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.BindConfiguration("CertificateSerialNumbers", new CertificateSerialNumbers());
builder.BindConfiguration("Endpoints", new Endpoints());
builder.BindConfiguration("Logging", new Logging());

// Services
builder.Services.AddScoped<IStiService, StiService>();

// Misc
builder.ConfigureCertificate();
// builder.Services.AddAuthentication();
// builder.Services.AddAuthorization();
builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(
    json =>
    {
        json.SerializerOptions.PropertyNameCaseInsensitive = true;
        json.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    }
);

var application = builder.Build();

// application.UseAuthentication();
// application.UseAuthorization();

// Endpoints
application
    .MapGroup("/api/v1/accounting/sti")
    .MapStiEndpoints();

if (application.Environment.IsDevelopment())
{
    application.MapOpenApi();
}

// application.UseCors();
// application.UseHttpsRedirection();
// application.UseHsts();
application.Run();