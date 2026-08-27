using System.Threading.RateLimiting;
using LastAsylumWiki.Server;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;

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
var tutorialMediaPath = builder.Configuration["TutorialMedia:Path"] ?? "App_Data/tutorials";
var resolvedTutorialMediaPath = Path.GetFullPath(
    tutorialMediaPath,
    builder.Environment.ContentRootPath);
var checklistStore = new ChecklistStore(resolvedChecklistPath);
var tutorialImageStore = new TutorialImageStore(resolvedTutorialMediaPath);
tutorialImageStore.RemoveUnreferenced(checklistStore.GetSnapshot(), TimeSpan.Zero);
builder.Services.AddSingleton(checklistStore);
builder.Services.AddSingleton(tutorialImageStore);
builder.Services.AddSingleton<AdminSessionStore>();
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = TutorialImageStore.MaxImageBytes + 64 * 1024;
});

var app = builder.Build();
_ = app.Services.GetRequiredService<AdminSessionStore>();

app.UseRateLimiter();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(resolvedTutorialMediaPath),
    RequestPath = "/tutorial-media",
    OnPrepareResponse = context =>
    {
        context.Context.Response.Headers.XContentTypeOptions = "nosniff";
        context.Context.Response.Headers.CacheControl = "public,max-age=31536000,immutable";
    },
});

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
    TutorialImageStore images,
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
        images.RemoveUnreferenced(updated, TimeSpan.FromHours(1));
        return Results.Json(updated);
    }
    catch (ChecklistConcurrencyException)
    {
        return Results.Conflict(new ApiMessage(
            "The checklist changed after this editor loaded. Reload before saving again."));
    }
});

admin.MapPost("/tutorial-images", async (
    HttpRequest request,
    AdminSessionStore sessions,
    TutorialImageStore images,
    CancellationToken cancellationToken) =>
{
    if (!sessions.IsAuthorized(request) ||
        !string.Equals(
            request.Headers["X-Requested-With"],
            "LastAsylumAdmin",
            StringComparison.Ordinal))
    {
        return Results.Unauthorized();
    }

    if (!request.HasFormContentType)
    {
        return Results.BadRequest(new ApiMessage("A multipart image upload is required."));
    }

    try
    {
        var form = await request.ReadFormAsync(cancellationToken);
        var image = form.Files.GetFile("image");
        if (image is null)
        {
            return Results.BadRequest(new ApiMessage("The image field is required."));
        }

        await using var stream = image.OpenReadStream();
        var url = await images.SaveAsync(
            stream,
            image.ContentType,
            image.Length,
            cancellationToken);
        return Results.Json(new TutorialImageResponse(url));
    }
    catch (InvalidDataException error)
    {
        return Results.BadRequest(new ApiMessage(error.Message));
    }
});

admin.MapDelete("/tutorial-images/{fileName}", (
    string fileName,
    HttpRequest request,
    AdminSessionStore sessions,
    ChecklistStore checklist,
    TutorialImageStore images) =>
{
    if (!sessions.IsAuthorized(request) ||
        !string.Equals(
            request.Headers["X-Requested-With"],
            "LastAsylumAdmin",
            StringComparison.Ordinal))
    {
        return Results.Unauthorized();
    }

    return images.RemoveIfUnreferenced(fileName, checklist.GetSnapshot())
        ? Results.NoContent()
        : Results.Conflict(new ApiMessage(
            "The tutorial image is invalid or referenced by the saved checklist."));
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
