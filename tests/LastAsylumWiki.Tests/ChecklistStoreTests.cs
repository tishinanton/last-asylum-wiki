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
