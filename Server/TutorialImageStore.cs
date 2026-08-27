namespace LastAsylumWiki.Server;

public sealed class TutorialImageStore
{
    public const long MaxImageBytes = 5 * 1024 * 1024;
    public const long MaxStorageBytes = 200 * 1024 * 1024;

    private static readonly IReadOnlyDictionary<string, string> Extensions =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png",
            ["image/webp"] = ".webp",
        };
    private static readonly byte[] PngSignature =
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    private readonly SemaphoreSlim _writeLock = new(1, 1);

    public TutorialImageStore(string path)
    {
        Path = path;
        Directory.CreateDirectory(path);
    }

    public string Path { get; }

    public async Task<string> SaveAsync(
        Stream content,
        string contentType,
        long length,
        CancellationToken cancellationToken = default)
    {
        if (length is <= 0 or > MaxImageBytes)
        {
            throw new InvalidDataException("Tutorial image must be between 1 byte and 5 MB.");
        }

        if (!Extensions.TryGetValue(contentType, out var declaredExtension))
        {
            throw new InvalidDataException("Tutorial image must be JPEG, PNG, or WebP.");
        }

        await _writeLock.WaitAsync(cancellationToken);
        var temporaryPath = System.IO.Path.Combine(Path, $"{Guid.NewGuid():N}.upload");
        try
        {
            var currentBytes = Directory
                .EnumerateFiles(Path)
                .Where(IsStoredImage)
                .Sum(file => new FileInfo(file).Length);
            if (currentBytes + length > MaxStorageBytes)
            {
                throw new InvalidDataException("Tutorial image storage has reached its 200 MB limit.");
            }

            await using (var output = new FileStream(
                temporaryPath,
                FileMode.CreateNew,
                FileAccess.Write,
                FileShare.None,
                81920,
                useAsync: true))
            {
                var buffer = new byte[81920];
                long written = 0;
                int read;
                while ((read = await content.ReadAsync(buffer, cancellationToken)) > 0)
                {
                    written += read;
                    if (written > MaxImageBytes || currentBytes + written > MaxStorageBytes)
                    {
                        throw new InvalidDataException(
                            "Tutorial image exceeds its file or storage limit.");
                    }

                    await output.WriteAsync(buffer.AsMemory(0, read), cancellationToken);
                }

                if (written != length)
                {
                    throw new InvalidDataException("Tutorial image length did not match the upload.");
                }
            }

            var detectedExtension = DetectExtension(temporaryPath);
            if (detectedExtension is null ||
                !string.Equals(detectedExtension, declaredExtension, StringComparison.Ordinal))
            {
                throw new InvalidDataException(
                    "The uploaded content does not match its JPEG, PNG, or WebP type.");
            }

            var fileName = $"{Guid.NewGuid():N}{detectedExtension}";
            File.Move(temporaryPath, System.IO.Path.Combine(Path, fileName));
            return $"/tutorial-media/{fileName}";
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

    public void RemoveUnreferenced(ChecklistDocument document, TimeSpan minimumAge)
    {
        var referenced = document.Actions
            .SelectMany(action => action.Tutorial ?? [])
            .Select(slide => System.IO.Path.GetFileName(slide.ImageUrl))
            .ToHashSet(StringComparer.Ordinal);
        var cutoff = DateTime.UtcNow - minimumAge;

        foreach (var file in Directory.EnumerateFiles(Path).Where(IsStoredImage))
        {
            var info = new FileInfo(file);
            if (!referenced.Contains(info.Name) && info.LastWriteTimeUtc <= cutoff)
            {
                info.Delete();
            }
        }
    }

    public bool RemoveIfUnreferenced(string fileName, ChecklistDocument document)
    {
        if (!string.Equals(fileName, System.IO.Path.GetFileName(fileName), StringComparison.Ordinal) ||
            !IsStoredImage(fileName))
        {
            return false;
        }

        var referenced = document.Actions
            .SelectMany(action => action.Tutorial ?? [])
            .Select(slide => System.IO.Path.GetFileName(slide.ImageUrl))
            .Any(name => string.Equals(name, fileName, StringComparison.Ordinal));
        if (referenced)
        {
            return false;
        }

        var file = System.IO.Path.Combine(Path, fileName);
        if (File.Exists(file))
        {
            File.Delete(file);
        }

        return true;
    }

    private static bool IsStoredImage(string file)
    {
        var extension = System.IO.Path.GetExtension(file);
        return extension is ".jpg" or ".png" or ".webp";
    }

    private static string? DetectExtension(string file)
    {
        Span<byte> header = stackalloc byte[12];
        using var stream = File.OpenRead(file);
        var length = stream.Read(header);

        if (length >= 3 && header[0] == 0xff && header[1] == 0xd8 && header[2] == 0xff)
        {
            return ".jpg";
        }

        if (length >= 8 &&
            header[..8].SequenceEqual(PngSignature))
        {
            return ".png";
        }

        if (length >= 12 &&
            header[..4].SequenceEqual("RIFF"u8) &&
            header[8..12].SequenceEqual("WEBP"u8))
        {
            return ".webp";
        }

        return null;
    }
}
