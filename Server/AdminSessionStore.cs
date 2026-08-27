using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;

namespace LastAsylumWiki.Server;

public sealed class AdminSessionStore
{
    public const string CookieName = "last-asylum-admin";
    public static readonly TimeSpan SessionLifetime = TimeSpan.FromHours(8);

    private readonly byte[] _password;
    private readonly ConcurrentDictionary<string, DateTimeOffset> _sessions =
        new(StringComparer.Ordinal);

    public AdminSessionStore(IConfiguration configuration)
    {
        var password = configuration["Admin:Password"];
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException(
                "Admin:Password is required. Configure it with user secrets or an environment variable.");
        }

        _password = Encoding.UTF8.GetBytes(password);
    }

    public bool PasswordMatches(string candidate)
    {
        var candidateBytes = Encoding.UTF8.GetBytes(candidate ?? string.Empty);
        return candidateBytes.Length == _password.Length &&
               CryptographicOperations.FixedTimeEquals(candidateBytes, _password);
    }

    public string CreateSession()
    {
        RemoveExpiredSessions();
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        _sessions[token] = DateTimeOffset.UtcNow.Add(SessionLifetime);
        return token;
    }

    public bool IsAuthorized(HttpRequest request)
    {
        RemoveExpiredSessions();
        return request.Cookies.TryGetValue(CookieName, out var token) &&
               _sessions.TryGetValue(token, out var expiresAt) &&
               expiresAt > DateTimeOffset.UtcNow;
    }

    public void EndSession(HttpRequest request)
    {
        if (request.Cookies.TryGetValue(CookieName, out var token))
        {
            _sessions.TryRemove(token, out _);
        }
    }

    private void RemoveExpiredSessions()
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var session in _sessions)
        {
            if (session.Value <= now)
            {
                _sessions.TryRemove(session.Key, out _);
            }
        }
    }
}
