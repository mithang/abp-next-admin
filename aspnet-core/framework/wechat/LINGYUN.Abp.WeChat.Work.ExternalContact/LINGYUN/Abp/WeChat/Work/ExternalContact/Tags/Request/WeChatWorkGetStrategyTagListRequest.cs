using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
public class WeChatWorkGetStrategyTagListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; }
    /// <summary>
    /// Id thẻ cần truy vấn
    /// </summary>
    [CanBeNull]
    [JsonProperty("tag_id")]
    [JsonPropertyName("tag_id")]
    public string[]? TagId { get; }
    /// <summary>
    /// Id nhóm thẻ cần truy vấn, trả về nhóm thẻ đó cùng tất cả thông tin thẻ thuộc nó
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_id")]
    [JsonPropertyName("group_id")]
    public string[]? GroupId { get; }
    public WeChatWorkGetStrategyTagListRequest(
        int strategyId,
        string[]? tagId = null,
        string[]? groupId = null)
    {
        Check.NotDefaultOrNull<int>(strategyId, nameof(strategyId));

        StrategyId = strategyId;
        TagId = tagId;
        GroupId = groupId;
    }
}
