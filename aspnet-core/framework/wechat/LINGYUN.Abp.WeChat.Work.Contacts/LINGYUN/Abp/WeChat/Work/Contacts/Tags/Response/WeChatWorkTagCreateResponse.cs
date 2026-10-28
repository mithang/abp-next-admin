using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Response;
/// <summary>
/// Tham số phản hồi tạo thẻ
/// </summary>
/// <remarks>
/// Xem chi tiết tại: https://developer.work.weixin.qq.com/document/path/90210
/// </remarks>
public class WeChatWorkTagCreateResponse : WeChatWorkResponse
{
    /// <summary>
    /// Id thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("tagid")]
    [JsonPropertyName("tagid")]
    public int TagId { get; set; }
}
