namespace Accounting.Contract.Configuration;

public class Butenta
{
    public Auth Auth { get; set; }
    public string ClientsEndpoint { get; set; } = null!;
    public string TradeEndpoint { get; set; } = null!;
}

public class Auth
{
    public string Password { get; set; } = null!;
    public string Username { get; set; } = null!;
}