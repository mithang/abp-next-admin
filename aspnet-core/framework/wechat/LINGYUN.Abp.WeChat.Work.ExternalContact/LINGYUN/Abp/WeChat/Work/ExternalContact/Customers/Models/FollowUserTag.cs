using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Thẻ mà liên hệ bên ngoài được gắn
/// </summary>
public class FollowUserTag
{
    /// <summary>
    /// Tên nhóm thẻ mà thành viên này đã gắn cho liên hệ bên ngoài này
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_name")]
    [JsonPropertyName("group_name")]
    public string? GroupName { get; set; }
    /// <summary>
    /// Tên thẻ mà thành viên này đã gắn cho liên hệ bên ngoài này
    /// </summary>
    [NotNull]
    [JsonProperty("tag_name")]
    [JsonPropertyName("tag_name")]
    public string TagName { get; set; } = default!;
    /// <summary>
    /// Loại thẻ mà thành viên này đã gắn cho liên hệ bên ngoài này
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public FollowUserTagType Type { get; set; }
    /// <summary>
    /// Id thẻ doanh nghiệp mà thành viên này đã gắn cho liên hệ bên ngoài này, thẻ loại do người dùng tự định nghĩa (type=2) không được trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("tag_id")]
    [JsonPropertyName("tag_id")]
    public string? TagId { get; set; }
}
