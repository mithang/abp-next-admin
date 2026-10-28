using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.Topic;
/// <summary>
/// Chi tiết nhóm tôi đã tham gia
/// </summary>
public class PushPlusTopicForMe : PushPlusTopic
{
    /// <summary>
    /// Phương thức liên hệ
    /// </summary>
    [JsonProperty("contact")]
    public string? Contact { get; set; }
    /// <summary>
    /// Giới thiệu nhóm
    /// </summary>
    [JsonProperty("introduction")]
    public string? Introduction { get; set; }
}
