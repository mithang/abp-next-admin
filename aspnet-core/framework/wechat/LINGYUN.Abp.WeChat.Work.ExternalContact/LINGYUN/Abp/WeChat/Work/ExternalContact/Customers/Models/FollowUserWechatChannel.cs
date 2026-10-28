using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Thông tin kênh video
/// </summary>
public class FollowUserWechatChannel
{
    /// <summary>
    /// Tên kênh video
    /// </summary>
    [NotNull]
    [JsonProperty("nickname")]
    [JsonPropertyName("nickname")]
    public string NickName { get; set; } = default!;
    /// <summary>
    /// Bối cảnh thêm kênh video
    /// </summary>
    [NotNull]
    [JsonProperty("source")]
    [JsonPropertyName("source")]
    public FollowUserWechatChannelSource Source { get; set; }
}
