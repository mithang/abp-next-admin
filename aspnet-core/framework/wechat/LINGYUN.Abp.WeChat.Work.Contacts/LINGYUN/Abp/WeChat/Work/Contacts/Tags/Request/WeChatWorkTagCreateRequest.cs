using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Request;
/// <summary>
/// Tham số yêu cầu tạo thẻ
/// </summary>
public class WeChatWorkTagCreateRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id thẻ, số nguyên không âm, khi chỉ định tham số này thì thẻ mới tạo sẽ sinh ra id thẻ tương ứng, khi không chỉ định thì tự tăng từ id lớn nhất hiện tại.
    /// </summary>
    [NotNull]
    [JsonProperty("tagid")]
    [JsonPropertyName("tagid")]
    public int? TagId { get; set; }
    /// <summary>
    /// Tên thẻ, giới hạn độ dài trong 32 ký tự (ký tự chữ Hán hoặc chữ cái tiếng Anh), tên thẻ không được trùng với tên thẻ khác.
    /// </summary>
    [NotNull]
    [StringLength(32)]
    [JsonProperty("tagname")]
    [JsonPropertyName("tagname")]
    public string TagName { get; set; }
    public WeChatWorkTagCreateRequest(string tagName, int? tagId = null)
    {
        TagName = Check.NotNullOrWhiteSpace(tagName, nameof(tagName), 32);
        TagId = tagId;
    }
}
