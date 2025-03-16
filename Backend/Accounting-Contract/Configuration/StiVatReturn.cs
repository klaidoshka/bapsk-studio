namespace Accounting.Contract.Configuration;

/// <summary>
/// Configuration responsible for STI VAT return settings.
/// </summary>
public class StiVatReturn
{
    public string CertificatePassword { get; set; } = null!;
    public string CertificatePath { get; set; } = null!;
    public string CertificateSerialNumber { get; set; } = null!;
    public string Endpoint { get; set; } = null!;
    public Intermediary Intermediary { get; set; } = null!;
}

public class Intermediary
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
}