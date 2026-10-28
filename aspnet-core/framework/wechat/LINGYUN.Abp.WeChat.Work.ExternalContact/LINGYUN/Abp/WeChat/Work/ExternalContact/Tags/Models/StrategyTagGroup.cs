using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Models;
public class StrategyTagGroup : TagGroup
{
    /// <summary>
    /// ID nhóm quy tắc mà nhóm nhãn thuộc về
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; set; }
    /// <summary>
    /// Danh sách nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("tag")]
    [JsonPropertyName("tag")]
    public StrategyTag[] Tag { get; set; } = default!;
}
