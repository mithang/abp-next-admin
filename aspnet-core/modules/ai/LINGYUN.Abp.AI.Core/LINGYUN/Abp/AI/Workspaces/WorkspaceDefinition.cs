using JetBrains.Annotations;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Localization;
using Volo.Abp.SimpleStateChecking;

namespace LINGYUN.Abp.AI.Workspaces;
/// <summary>
/// Định nghĩa không gian làm việc
/// </summary>
public class WorkspaceDefinition : IHasSimpleStateCheckers<WorkspaceDefinition>
{
    /// <summary>
    /// Tên
    /// </summary>
    [NotNull]
    public string Name { get; }
    /// <summary>
    /// Tên nhà cung cấp AI
    /// </summary>
    [NotNull]
    public string Provider { get; }
    /// <summary>
    /// Tên mô hình
    /// </summary>
    [NotNull]
    public string ModelName { get; }
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    [NotNull]
    public ILocalizableString DisplayName {
        get => _displayName;
        set => _displayName = Check.NotNull(value, nameof(value));
    }
    private ILocalizableString _displayName = default!;
    /// <summary>
    /// Mô tả
    /// </summary>
    public ILocalizableString? Description { get; set; }
    /// <summary>
    /// Khóa xác thực API
    /// </summary>
    public string? ApiKey { get; private set; }
    /// <summary>
    /// URL điểm cuối tùy chỉnh
    /// </summary>
    public string? ApiBaseUrl { get; private set; }
    /// <summary>
    /// Lời nhắc hệ thống
    /// </summary>
    public string? SystemPrompt { get; set; }
    /// <summary>
    /// Lời nhắc hệ thống bổ sung
    /// </summary>
    public string? Instructions { get; set; }
    /// <summary>
    /// Giá trị temperature dùng làm cơ sở khi trả lời trò chuyện, khi để trống thì nhà cung cấp mô hình quyết định giá trị mặc định
    /// </summary>
    /// <remarks>
    /// Phạm vi từ 0 đến 2, giá trị càng cao (ví dụ 0,8) càng khiến đầu ra ngẫu nhiên hơn, còn giá trị càng thấp (ví dụ 0,2) càng khiến đầu ra tập trung và xác định hơn
    /// </remarks>
    public float? Temperature {
        get => _temperature;
        set {
            if (value.HasValue)
            {
                _temperature = Check.Range(value.Value, nameof(value), 0, 2);
            }
            else
            {
                _temperature = value;
            }
        }
    }
    private float? _temperature;
    /// <summary>
    /// Giới hạn số token tối đa mà mô hình sinh completion trong một lần yêu cầu
    /// </summary>
    public int? MaxOutputTokens { get; set; }
    /// <summary>
    /// Số trong khoảng từ -2,0 đến 2,0
    /// </summary>
    /// <remarks>
    /// Nếu giá trị này dương, token mới sẽ chịu hình phạt tương ứng theo tần suất xuất hiện trong văn bản hiện có, làm giảm khả năng mô hình lặp lại cùng nội dung
    /// </remarks>
    public float? FrequencyPenalty {
        get => _frequencyPenalty;
        set {
            if (value.HasValue)
            {
                _frequencyPenalty = Check.Range(value.Value, nameof(value), -2, 2);
            }
            else
            {
                _frequencyPenalty = value;
            }
        }
    }
    private float? _frequencyPenalty;
    /// <summary>
    /// Số trong khoảng từ -2,0 đến 2,0
    /// </summary>
    /// <remarks>
    /// Nếu giá trị này dương, token mới sẽ chịu hình phạt tương ứng theo việc nó đã xuất hiện trong văn bản hiện có hay chưa, từ đó tăng khả năng mô hình bàn về chủ đề mới
    /// </remarks>
    public float? PresencePenalty {
        get => _presencePenalty;
        set {
            if (value.HasValue)
            {
                _presencePenalty = Check.Range(value.Value, nameof(value), -2, 2);
            }
            else
            {
                _presencePenalty = value;
            }
        }
    }
    private float? _presencePenalty;
    /// <summary>
    /// Bật/tắt không gian làm việc
    /// </summary>
    public bool IsEnabled { get; set; }

    [NotNull]
    public Dictionary<string, object> Properties { get; }

    [NotNull]
    public List<string> Tools { get; }

    public List<ISimpleStateChecker<WorkspaceDefinition>> StateCheckers { get; }

    public WorkspaceDefinition(
        string name, 
        string provider,
        string modelName, 
        ILocalizableString displayName, 
        ILocalizableString? description = null,
        string? systemPrompt = null,
        string? instructions = null,
        float? temperature = null,
        int? maxOutputTokens = null,
        float? frequencyPenalty = null,
        float? presencePenalty = null)
    {
        Name = name;
        Provider = provider;
        ModelName = modelName;
        DisplayName = displayName;
        Description = description;
        SystemPrompt = systemPrompt;
        Instructions = instructions;
        Temperature = temperature;
        MaxOutputTokens = maxOutputTokens;
        FrequencyPenalty = frequencyPenalty;
        PresencePenalty = presencePenalty;

        IsEnabled = true;
        Tools = new List<string>();
        Properties = new Dictionary<string, object>();
        StateCheckers = new List<ISimpleStateChecker<WorkspaceDefinition>>();
    }

    public virtual WorkspaceDefinition WithApiBaseUrl(string apiBaseUrl)
    {
        ApiBaseUrl = apiBaseUrl;
        return this;
    }

    public virtual WorkspaceDefinition WithApiKey(string apiKey)
    {
        ApiKey = apiKey;
        return this;
    }

    public virtual WorkspaceDefinition WithTools(params string[] tools)
    {
        Tools.AddIfNotContains(tools);
        return this;
    }

    public virtual WorkspaceDefinition WithProperty(string key, object value)
    {
        Properties[key] = value;
        return this;
    }

    public override string ToString()
    {
        return $"[{nameof(WorkspaceDefinition)} {Name}]";
    }
}
