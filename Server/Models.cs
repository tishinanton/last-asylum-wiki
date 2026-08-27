using System.Text.Json.Serialization;

namespace LastAsylumWiki.Server;

public sealed record AdminLoginRequest(string Password);

public sealed record ApiMessage(string Message);

public sealed record AdminSessionResponse(bool Authorized);

public sealed record TutorialImageResponse(string Url);

public sealed class LocalizedText
{
    [JsonPropertyName("ru")]
    public required string Ru { get; init; }

    [JsonPropertyName("en")]
    public required string En { get; init; }
}

public sealed class ChecklistAction
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("eventId")]
    public required string EventId { get; init; }

    [JsonPropertyName("schedule")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Schedule { get; init; }

    [JsonPropertyName("phaseId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PhaseId { get; init; }

    [JsonPropertyName("themeId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ThemeId { get; init; }

    [JsonPropertyName("label")]
    public required LocalizedText Label { get; init; }

    [JsonPropertyName("overlapGroups")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<string>? OverlapGroups { get; init; }

    [JsonPropertyName("sourceIds")]
    public required IReadOnlyList<string> SourceIds { get; init; }

    [JsonPropertyName("confidence")]
    public required string Confidence { get; init; }

    [JsonPropertyName("verificationIds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<string>? VerificationIds { get; init; }

    [JsonPropertyName("tutorial")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<TutorialSlide>? Tutorial { get; init; }
}

public sealed class TutorialSlide
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("imageUrl")]
    public required string ImageUrl { get; init; }

    [JsonPropertyName("description")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LocalizedText? Description { get; init; }
}

public sealed class StockpileItem
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("label")]
    public required LocalizedText Label { get; init; }

    [JsonPropertyName("sourceIds")]
    public required IReadOnlyList<string> SourceIds { get; init; }

    [JsonPropertyName("confidence")]
    public required string Confidence { get; init; }

    [JsonPropertyName("verificationIds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<string>? VerificationIds { get; init; }
}

public sealed class StockpilePlan
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("targetPhaseId")]
    public required string TargetPhaseId { get; init; }

    [JsonPropertyName("items")]
    public required IReadOnlyList<StockpileItem> Items { get; init; }
}

public sealed record ChecklistDocument
{
    [JsonPropertyName("revision")]
    public required long Revision { get; init; }

    [JsonPropertyName("schemaVersion")]
    public required int SchemaVersion { get; init; }

    [JsonPropertyName("dataAsOf")]
    public required string DataAsOf { get; init; }

    [JsonPropertyName("actions")]
    public required IReadOnlyList<ChecklistAction> Actions { get; init; }

    [JsonPropertyName("stockpiles")]
    public required IReadOnlyList<StockpilePlan> Stockpiles { get; init; }
}
