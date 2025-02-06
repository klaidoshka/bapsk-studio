namespace Accounting.Contract.Service;

public interface IHashService
{
    /// <summary>
    /// Hashes the given value
    /// </summary>
    /// <param name="value">To hash</param>
    /// <returns>Hashed one-way value</returns>
    string Hash(string value);

    /// <summary>
    /// Verifies the given value with the hash
    /// </summary>
    /// <param name="value">Value to verify</param>
    /// <param name="hash">Candidate hash to check value against</param>
    /// <returns>True if matches, otherwise false</returns>
    bool Verify(string value, string hash);
}