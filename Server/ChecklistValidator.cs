namespace LastAsylumWiki.Server;

public static class ChecklistValidator
{
    private static readonly HashSet<string> EventIds =
        ["alliance-duel", "survival-battle"];

    private static readonly HashSet<string> ConfidenceLevels =
        ["high", "medium", "low"];

    public static Dictionary<string, string[]> Validate(ChecklistDocument document)
    {
        var errors = new Dictionary<string, List<string>>(StringComparer.Ordinal);
        var ids = new HashSet<string>(StringComparer.Ordinal);

        if (document.Revision < 1)
        {
            Add(errors, "revision", "Revision must be at least 1.");
        }

        if (document.SchemaVersion < 1)
        {
            Add(errors, "schemaVersion", "Schema version must be at least 1.");
        }

        if (!DateOnly.TryParse(document.DataAsOf, out _))
        {
            Add(errors, "dataAsOf", "Data date must use YYYY-MM-DD.");
        }

        for (var index = 0; index < document.Actions.Count; index++)
        {
            var action = document.Actions[index];
            var path = $"actions[{index}]";
            ValidateId(action.Id, $"{path}.id", ids, errors);
            ValidateLabel(action.Label, $"{path}.label", errors);

            if (!EventIds.Contains(action.EventId))
            {
                Add(errors, $"{path}.eventId", "Event must be alliance-duel or survival-battle.");
            }

            if (!ConfidenceLevels.Contains(action.Confidence))
            {
                Add(errors, $"{path}.confidence", "Confidence must be high, medium, or low.");
            }

            if (action.SourceIds.Count == 0)
            {
                Add(errors, $"{path}.sourceIds", "At least one source ID is required.");
            }
        }

        for (var planIndex = 0; planIndex < document.Stockpiles.Count; planIndex++)
        {
            var plan = document.Stockpiles[planIndex];
            var planPath = $"stockpiles[{planIndex}]";
            ValidateId(plan.Id, $"{planPath}.id", ids, errors);

            if (string.IsNullOrWhiteSpace(plan.TargetPhaseId))
            {
                Add(errors, $"{planPath}.targetPhaseId", "Target phase is required.");
            }

            for (var itemIndex = 0; itemIndex < plan.Items.Count; itemIndex++)
            {
                var item = plan.Items[itemIndex];
                var path = $"{planPath}.items[{itemIndex}]";
                ValidateId(item.Id, $"{path}.id", ids, errors);
                ValidateLabel(item.Label, $"{path}.label", errors);

                if (!ConfidenceLevels.Contains(item.Confidence))
                {
                    Add(errors, $"{path}.confidence", "Confidence must be high, medium, or low.");
                }

                if (item.SourceIds.Count == 0)
                {
                    Add(errors, $"{path}.sourceIds", "At least one source ID is required.");
                }
            }
        }

        return errors.ToDictionary(
            entry => entry.Key,
            entry => entry.Value.ToArray(),
            StringComparer.Ordinal);
    }

    private static void ValidateId(
        string id,
        string path,
        HashSet<string> ids,
        Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            Add(errors, path, "ID is required.");
        }
        else if (!ids.Add(id))
        {
            Add(errors, path, "ID must be unique.");
        }
    }

    private static void ValidateLabel(
        LocalizedText label,
        string path,
        Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(label.Ru))
        {
            Add(errors, $"{path}.ru", "Russian label is required.");
        }

        if (string.IsNullOrWhiteSpace(label.En))
        {
            Add(errors, $"{path}.en", "English label is required.");
        }
    }

    private static void Add(
        Dictionary<string, List<string>> errors,
        string key,
        string message)
    {
        if (!errors.TryGetValue(key, out var messages))
        {
            messages = [];
            errors[key] = messages;
        }

        messages.Add(message);
    }
}
