using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.PushPlus.Topic;
/// <summary>
/// Nhóm
/// </summary>
public class PushPlusTopic
{
    /// <summary>
    /// Mã số nhóm
    /// </summary>
    [JsonProperty("topicId")]
    public int TopicId { get; set; }
    /// <summary>
    /// Mã nhóm
    /// </summary>
    [JsonProperty("topicCode")]
    public string TopicCode { get; set; } = default!;
    /// <summary>
    /// Tên nhóm
    /// </summary>
    [JsonProperty("topicName")]
    public string TopicName { get; set; } = default!;
    /// <summary>
    /// Thời gian tạo
    /// </summary>
    [JsonProperty("createTime")]
    public DateTime CreateTime { get; set; }
}
