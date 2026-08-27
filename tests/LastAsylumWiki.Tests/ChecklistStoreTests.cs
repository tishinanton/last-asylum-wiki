using System.Text.Json;
using LastAsylumWiki.Server;

namespace LastAsylumWiki.Tests;

public sealed class ChecklistStoreTests : IDisposable
{
    private readonly string _directory =
        Path.Combine(Path.GetTempPath(), $"last-asylum-tests-{Guid.NewGuid():N}");

    [Fact]
    public async Task UpdateAsync_ReplacesMemoryAndJsonFile()
    {
        Directory.CreateDirectory(_directory);
        var path = Path.Combine(_directory, "checklist.json");
        var original = CreateDocument("first-action");
        await File.WriteAllTextAsync(path, JsonSerializer.Serialize(original));
        var store = new ChecklistStore(path);

        var updated = CreateDocument("updated-action");
        var saved = await store.UpdateAsync(updated);

        Assert.Equal("updated-action", store.GetSnapshot().Actions[0].Id);
        Assert.Equal(2, saved.Revision);
        var persisted = JsonSerializer.Deserialize<ChecklistDocument>(
            await File.ReadAllTextAsync(path),
            new JsonSerializerOptions(JsonSerializerDefaults.Web));
        Assert.Equal("updated-action", persisted!.Actions[0].Id);
        Assert.False(File.Exists($"{path}.tmp"));
    }

    [Fact]
    public void Validate_RejectsDuplicateStableIds()
    {
        var document = CreateDocument("shared-id", "shared-id");

        var errors = ChecklistValidator.Validate(document);

        Assert.Contains("stockpiles[0].items[0].id", errors.Keys);
    }

    [Fact]
    public async Task UpdateAsync_RejectsStaleRevision()
    {
        Directory.CreateDirectory(_directory);
        var path = Path.Combine(_directory, "checklist.json");
        var original = CreateDocument("first-action");
        await File.WriteAllTextAsync(path, JsonSerializer.Serialize(original));
        var store = new ChecklistStore(path);

        await store.UpdateAsync(CreateDocument("second-action"));

        var error = await Assert.ThrowsAsync<ChecklistConcurrencyException>(
            () => store.UpdateAsync(CreateDocument("stale-action")));
        Assert.Equal(1, error.SubmittedRevision);
        Assert.Equal(2, error.CurrentRevision);
        Assert.Equal("second-action", store.GetSnapshot().Actions[0].Id);
    }

    [Fact]
    public void Validate_RejectsTutorialImagesOutsideLocalMediaPath()
    {
        var document = CreateDocument("action-with-tutorial") with
        {
            Actions =
            [
                new ChecklistAction
                {
                    Id = "action-with-tutorial",
                    EventId = "alliance-duel",
                    PhaseId = "AD-D1-RAVEN",
                    Label = new LocalizedText { Ru = "Действие", En = "Action" },
                    SourceIds = ["S1"],
                    Confidence = "high",
                    Tutorial =
                    [
                        new TutorialSlide
                        {
                            Id = "slide-1",
                            ImageUrl = "https://example.com/image.webp",
                        },
                    ],
                },
            ],
        };

        var errors = ChecklistValidator.Validate(document);

        Assert.Contains("actions[0].tutorial[0].imageUrl", errors.Keys);
    }

    [Fact]
    public async Task TutorialImageStore_SavesSupportedImageWithGeneratedName()
    {
        var path = Path.Combine(_directory, "tutorials");
        var store = new TutorialImageStore(path);
        byte[] image = "RIFF1234WEBP"u8.ToArray();
        await using var content = new MemoryStream(image);

        var url = await store.SaveAsync(content, "image/webp", content.Length);

        Assert.StartsWith("/tutorial-media/", url);
        Assert.EndsWith(".webp", url);
        var storedPath = Path.Combine(path, Path.GetFileName(url));
        Assert.Equal(image, await File.ReadAllBytesAsync(storedPath));
    }

    [Fact]
    public async Task TutorialImageStore_RejectsUnsupportedImageType()
    {
        var store = new TutorialImageStore(Path.Combine(_directory, "tutorials"));
        await using var content = new MemoryStream([1, 2, 3]);

        var error = await Assert.ThrowsAsync<InvalidDataException>(
            () => store.SaveAsync(content, "image/svg+xml", content.Length));

        Assert.Contains("JPEG, PNG, or WebP", error.Message);
    }

    [Fact]
    public async Task TutorialImageStore_RejectsSpoofedImageContent()
    {
        var store = new TutorialImageStore(Path.Combine(_directory, "tutorials"));
        await using var content = new MemoryStream([1, 2, 3, 4]);

        var error = await Assert.ThrowsAsync<InvalidDataException>(
            () => store.SaveAsync(content, "image/webp", content.Length));

        Assert.Contains("does not match", error.Message);
    }

    [Fact]
    public async Task TutorialImageStore_RemovesUnreferencedUpload()
    {
        var path = Path.Combine(_directory, "tutorials");
        var store = new TutorialImageStore(path);
        byte[] image = "RIFF1234WEBP"u8.ToArray();
        await using var content = new MemoryStream(image);
        var url = await store.SaveAsync(content, "image/webp", content.Length);
        var fileName = Path.GetFileName(url);

        var removed = store.RemoveIfUnreferenced(fileName, CreateDocument("action"));

        Assert.True(removed);
        Assert.False(File.Exists(Path.Combine(path, fileName)));
    }

    public void Dispose()
    {
        if (Directory.Exists(_directory))
        {
            Directory.Delete(_directory, recursive: true);
        }
    }

    private static ChecklistDocument CreateDocument(
        string actionId,
        string reserveId = "reserve-id")
    {
        return new ChecklistDocument
        {
            Revision = 1,
            SchemaVersion = 1,
            DataAsOf = "2026-08-27",
            Actions =
            [
                new ChecklistAction
                {
                    Id = actionId,
                    EventId = "alliance-duel",
                    PhaseId = "AD-D1-RAVEN",
                    Label = new LocalizedText { Ru = "Действие", En = "Action" },
                    SourceIds = ["S1"],
                    Confidence = "high",
                },
            ],
            Stockpiles =
            [
                new StockpilePlan
                {
                    Id = "plan-id",
                    TargetPhaseId = "AD-D2-CONSTRUCTION",
                    Items =
                    [
                        new StockpileItem
                        {
                            Id = reserveId,
                            Label = new LocalizedText { Ru = "Запас", En = "Reserve" },
                            SourceIds = ["S1"],
                            Confidence = "high",
                        },
                    ],
                },
            ],
        };
    }
}
