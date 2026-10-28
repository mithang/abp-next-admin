using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Tags.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách thẻ
/// </summary>
/// <remarks>
/// Chi tiết xem: https://developer.work.weixin.qq.com/document/path/90216
/// </remarks>
public class WeChatWorkTagListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("taglist")]
    [JsonPropertyName("taglist")]
    public TagInfo[] Tags { get; set; } = default!;
}