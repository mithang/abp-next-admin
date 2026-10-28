using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Tags.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Response;
/// <summary>
/// Tham số phản hồi thành viên thẻ
/// </summary>
/// <remarks>
/// Chi tiết xem tại: https://developer.work.weixin.qq.com/document/path/90213
/// </remarks>
public class WeChatWorkTagMemberInfoResponse : WeChatWorkResponse
{
    /// <summary>
    /// Tên thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("tagname")]
    [JsonPropertyName("tagname")]
    public string TagName { get; set; } = default!;
    /// <summary>
    /// Danh sách thành viên thuộc thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("userlist")]
    [JsonPropertyName("userlist")]
    public TagUserInfo[] Users { get; set; } = default!;
    /// <summary>
    /// Danh sách id phòng ban thuộc thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("partylist")]
    [JsonPropertyName("partylist")]
    public int[] Parts { get; set; } = default!;
}
