using System.Security.Cryptography;
using Accounting.Contract.Service;

namespace Accounting.Services.Service;

public class HashService : IHashService
{
    /// <summary>
    /// Size of the hash (in bytes)
    /// </summary>
    private const int HashSize = 32;

    /// <summary>
    /// Size of the salt (in bytes)
    /// </summary>
    private const int SaltSize = 16;

    /// <summary>
    /// Number of iterations
    /// </summary>
    private const int Iterations = 10000;

    public string Hash(string value)
    {
        var salt = GenerateSalt();
        var hash = Hash(value, salt);

        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    public bool Verify(string value, string hash)
    {
        var parts = hash.Split(':');

        if (parts.Length != 2)
        {
            return false;
        }

        var salt = Convert.FromBase64String(parts[0]);
        var expectedHash = Convert.FromBase64String(parts[1]);
        var testHash = Hash(value, salt);

        return testHash.SequenceEqual(expectedHash);
    }

    private static byte[] GenerateSalt()
    {
        var salt = new byte[SaltSize];
        using var rng = RandomNumberGenerator.Create();

        rng.GetBytes(salt);

        return salt;
    }

    private static byte[] Hash(string value, byte[] salt)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(
            value,
            salt,
            Iterations,
            HashAlgorithmName.SHA256
        );

        return pbkdf2.GetBytes(HashSize);
    }
}