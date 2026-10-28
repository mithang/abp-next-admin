using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Models;
/// <summary>
/// Tình trạng đồng ý trò chuyện riêng
/// </summary>
public class UserAgreeInfo
{
    /// <summary>
    /// Userid của thành viên nội bộ
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Exteranalopenid của thành viên bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("exteranalopenid")]
    [JsonPropertyName("exteranalopenid")]
    public string ExteranalOpenId { get; set; } = default!;
    /// <summary>
    /// Đồng ý: "Agree", không đồng ý: "Disagree"
    /// </summary>
    [NotNull]
    [JsonProperty("agree_status")]
    [JsonPropertyName("agree_status")]
    public string AgreeStatus { get; set; } = default!;
    /// <summary>
    /// Thời gian cụ thể trạng thái đồng ý thay đổi, giờ UTC
    /// </summary>
    [CanBeNull]
    [JsonProperty("status_change_time")]
    [JsonPropertyName("status_change_time")]
    public long? StatusChangeTime { get; set; }
}
