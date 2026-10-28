using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Request;
/// <summary>
/// Tham số yêu cầu lấy nhãn
/// </summary>
public class WeChatWorkGetTagRequest
{
    /// <summary>
    /// ID nhãn
    /// </summary>
    [NotNull]
    [JsonProperty("tagid")]
    [JsonPropertyName("tagid")]
    public int TagId { get; set; }
    public WeChatWorkGetTagRequest(int tagId)
    {
        TagId = Check.Positive(tagId, nameof(tagId));
    }
}
