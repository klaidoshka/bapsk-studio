using Accounting.API;
using Accounting.API.Endpoint;
using Accounting.Contract.Configuration;
using Accounting.Contract.Sti;
using Accounting.Services;
using Accounting.Services.Sti;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddOpenApi();

// Configuration
builder.BindConfiguration("CertificateSerialNumbers", new CertificateSerialNumbers());
builder.BindConfiguration("Endpoints", new Endpoints());

// Services
builder.Services.AddScoped<IStiService, StiService>();

var app = builder.Build();

// Endpoints
app
    .MapGroup("/api/v1/accounting/sti")
    .MapStiEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.Run();