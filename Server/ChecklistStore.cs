using System.Text.Json;
using System.Text.Encodings.Web;

namespace LastAsylumWiki.Server;

public sealed class ChecklistStore
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true,
    };

    private readonly string _path;
    private readonly SemaphoreSlim _writeLock = new(1, 1);
    private ChecklistDocument _document;

    public ChecklistStore(string path)
    {
        _path = path;
        _document = Load(path);
    }

    public ChecklistDocument GetSnapshot()
    {
        return Clone(_document);
    }

    public async Task<ChecklistDocument> UpdateAsync(
        ChecklistDocument document,
        CancellationToken cancellationToken = default)
    {
        var temporaryPath = $"{_path}.tmp";

        await _writeLock.WaitAsync(cancellationToken);
        try
        {
            if (document.Revision != _document.Revision)
            {
                throw new ChecklistConcurrencyException(
                    document.Revision,
                    _document.Revision);
            }

            var snapshot = Clone(document) with
            {
                Revision = _document.Revision + 1,
            };
            var json = JsonSerializer.Serialize(snapshot, JsonOptions);
            Directory.CreateDirectory(Path.GetDirectoryName(_path)!);
            await File.WriteAllTextAsync(temporaryPath, json, cancellationToken);
            File.Move(temporaryPath, _path, overwrite: true);
            _document = snapshot;
            return Clone(snapshot);
        }
        finally
        {
            if (File.Exists(temporaryPath))
            {
                File.Delete(temporaryPath);
            }

            _writeLock.Release();
        }
    }

    private static ChecklistDocument Load(string path)
    {
        if (!File.Exists(path))
        {
            throw new FileNotFoundException(
                $"Checklist data file was not found at '{path}'.",
                path);
        }

        var document = JsonSerializer.Deserialize<ChecklistDocument>(
            File.ReadAllText(path),
            JsonOptions)
            ?? throw new InvalidDataException("Checklist data file is empty.");

        var validationErrors = ChecklistValidator.Validate(document);
        if (validationErrors.Count > 0)
        {
            var details = string.Join(
                "; ",
                validationErrors.Select(error =>
                    $"{error.Key}: {string.Join(", ", error.Value)}"));
            throw new InvalidDataException($"Checklist data is invalid: {details}");
        }

        return document;
    }

    private static ChecklistDocument Clone(ChecklistDocument document)
    {
        var json = JsonSerializer.Serialize(document, JsonOptions);
        return JsonSerializer.Deserialize<ChecklistDocument>(json, JsonOptions)
            ?? throw new InvalidDataException("Checklist snapshot could not be cloned.");
    }
}

public sealed class ChecklistConcurrencyException(long submittedRevision, long currentRevision)
    : Exception($"Checklist revision {submittedRevision} is stale; current revision is {currentRevision}.")
{
    public long SubmittedRevision { get; } = submittedRevision;
    public long CurrentRevision { get; } = currentRevision;
}
