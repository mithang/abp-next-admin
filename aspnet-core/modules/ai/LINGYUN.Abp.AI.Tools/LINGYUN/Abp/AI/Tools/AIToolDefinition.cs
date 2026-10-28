using JetBrains.Annotations;
using System.Collections.Generic;
using Volo.Abp.Localization;
using Volo.Abp.SimpleStateChecking;

namespace LINGYUN.Abp.AI.Tools;

public class AIToolDefinition : IHasSimpleStateCheckers<AIToolDefinition>
{
    /// <summary>
    /// Tên
    /// </summary>
    [NotNull]
    public string Name { get; }
    /// <summary>
    /// Nhà cung cấp
    /// </summary>
    [NotNull]
    public string Provider { get; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public ILocalizableString? Description { get; set; }
    /// <summary>
    /// Thuộc tính
    /// </summary>
    [NotNull]
    public Dictionary<string, object?> Properties { get; }
    /// <summary>
    /// Bật/Tắt công cụ
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Công cụ toàn cục
    /// </summary>
    public bool IsGlobal { get; set; }

    public List<ISimpleStateChecker<AIToolDefinition>> StateCheckers { get; }

    public AIToolDefinition(
        [NotNull] string name,
        [NotNull] string provider, 
        ILocalizableString? description = null)
    {
        Name = name;
        Provider = provider;
        Description = description;

        IsEnabled = true;
        Properties = new Dictionary<string, object?>();
        StateCheckers = new List<ISimpleStateChecker<AIToolDefinition>>();
    }

    public virtual AIToolDefinition WithProperty(string key, object? value)
    {
        Properties[key] = value;
        return this;
    }

    public override string ToString()
    {
        return $"[{nameof(AIToolDefinition)} {Name}]";
    }
}
