using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
public class WeChatWorkCreateStrategyTagRequest : WeChatWorkRequest
{
    /// <summary>
    /// id nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; }
    /// <summary>
    /// id nhóm thẻ
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_id")]
    [JsonPropertyName("group_id")]
    public string? GroupId { get; set; }

    private string? _groupName;
    /// <summary>
    /// Tên nhóm thẻ, tối đa 30 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_name")]
    [JsonPropertyName("group_name")]
    public string? GroupName {
        get => _groupName;
        set {

            Check.Length(value, nameof(GroupName), 30);
            _groupName = value;
        }
    }
    /// <summary>
    /// Giá trị thứ tự sắp xếp của nhóm thẻ, giá trị order lớn hơn sẽ xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }
    /// <summary>
    /// Nhóm thẻ được thêm
    /// </summary>
    [CanBeNull]
    [JsonProperty("tag")]
    [JsonPropertyName("tag")]
    public List<NewStrategyTag> Tag { get; }

    public WeChatWorkCreateStrategyTagRequest(int strategyId)
    {
        Check.NotDefaultOrNull<int>(strategyId, nameof(strategyId));

        StrategyId = strategyId;

        Tag = new List<NewStrategyTag>();
    }
}

public class NewStrategyTag
{
    /// <summary>
    /// Tên thẻ được thêm, tối đa 30 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; }
    /// <summary>
    /// Giá trị thứ tự của thẻ. Giá trị order lớn hơn sẽ xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }
    public NewStrategyTag(string name, int? order = null)
    {
        Check.NotNullOrWhiteSpace(name, nameof(name), 30);

        Name = name;
        Order = order;
    }
}
