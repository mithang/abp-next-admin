using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Thuộc tính tài khoản Video
/// </summary>
public class WechatChannel
{
    /// <summary>
    /// Tên tài khoản Video (sau khi cài đặt, thành viên sẽ hiển thị tài khoản Video này ra bên ngoài)
    /// </summary>
    [NotNull]
    [JsonProperty("nickname")]
    [JsonPropertyName("nickname")]
    public string NickName { get; set; } = default!;
    /// <summary>
    /// Trạng thái hiển thị tài khoản Video ra bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public WechatChannelStatus Status { get; set; }
}
