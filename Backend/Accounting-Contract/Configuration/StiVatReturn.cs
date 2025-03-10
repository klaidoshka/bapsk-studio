namespace Accounting.Contract.Configuration;

/// <summary>
/// Configuration responsible for STI VAT return settings.
/// </summary>
public class StiVatReturn
{
    public string? CertificateSerialNumber { get; set; }
    public string? Endpoint { get; set; }
    public Intermediary Intermediary { get; set; }
}

public class Intermediary
{
    public string? Id { get; set; }
    public string? Name { get; set; }
}