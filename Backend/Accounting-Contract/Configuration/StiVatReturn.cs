namespace Accounting.Contract.Configuration;

public class StiVatReturn
{
    public string CertificatePassword { get; set; } = null!;
    public string CertificatePath { get; set; } = null!;
    public string Endpoint { get; set; } = null!;
    public Intermediary Sender { get; set; } = null!;
}

public class Intermediary
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
}