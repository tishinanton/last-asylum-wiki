using System.Threading.RateLimiting;
using LastAsylumWiki.Server;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("admin-login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var checklistPath = builder.Configuration["Checklist:Path"] ?? "App_Data/checklist.json";
var resolvedChecklistPath = Path.GetFullPath(checklistPath, builder.Environment.ContentRootPath);
builder.Services.AddSingleton(new ChecklistStore(resolvedChecklistPath));
builder.Services.AddSingleton<AdminSessionStore>();

var app = builder.Build();
_ = app.Services.GetRequiredService<AdminSessionStore>();

app.UseRateLimiter();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/checklist", (ChecklistStore store) => Results.Json(store.GetSnapshot()));

var admin = app.MapGroup("/api/admin");

admin.MapPost("/login", (AdminLoginRequest request, HttpContext context, AdminSessionStore sessions) =>
{
    if (!sessions.PasswordMatches(request.Password))
    {
        return Results.Json(
            new ApiMessage("Invalid password."),
            statusCode: StatusCodes.Status401Unauthorized);
    }

    var token = sessions.CreateSession();
    context.Response.Cookies.Append(
        AdminSessionStore.CookieName,
        token,
        new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            SameSite = SameSiteMode.Strict,
            Secure = context.Request.IsHttps,
            MaxAge = AdminSessionStore.SessionLifetime,
            Path = "/",
        });
    return Results.NoContent();
}).RequireRateLimiting("admin-login");

admin.MapGet("/session", (HttpContext context, AdminSessionStore sessions) =>
    Results.Json(new AdminSessionResponse(sessions.IsAuthorized(context.Request))));

admin.MapPut("/checklist", async (
    ChecklistDocument checklist,
    HttpContext context,
    ChecklistStore store,
    AdminSessionStore sessions,
    CancellationToken cancellationToken) =>
{
    if (!sessions.IsAuthorized(context.Request))
    {
        return Results.Unauthorized();
    }

    if (!string.Equals(
            context.Request.Headers["X-Requested-With"],
            "LastAsylumAdmin",
            StringComparison.Ordinal))
    {
        return Results.BadRequest(new ApiMessage("Missing admin request header."));
    }

    var validationErrors = ChecklistValidator.Validate(checklist);
    if (validationErrors.Count > 0)
    {
        return Results.ValidationProblem(validationErrors);
    }

    try
    {
        var updated = await store.UpdateAsync(checklist, cancellationToken);
        return Results.Json(updated);
    }
    catch (ChecklistConcurrencyException)
    {
        return Results.Conflict(new ApiMessage(
            "The checklist changed after this editor loaded. Reload before saving again."));
    }
});

admin.MapPost("/logout", (HttpContext context, AdminSessionStore sessions) =>
{
    sessions.EndSession(context.Request);
    context.Response.Cookies.Delete(
        AdminSessionStore.CookieName,
        new CookieOptions { Path = "/" });
    return Results.NoContent();
});

app.MapFallbackToFile("index.html");

app.Run();

public partial class Program;
