using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Request;
/// <summary>
/// Tham số yêu cầu cập nhật thẻ
/// </summary>
public class WeChatWorkTagUpdateRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id thẻ, số nguyên không âm; khi chỉ định tham số này, thẻ mới thêm sẽ tạo ra id thẻ tương ứng, khi không chỉ định thì tăng dần từ id lớn nhất hiện tại.
    /// </summary>
    [NotNull]
    [JsonProperty("tagid")]
    [JsonPropertyName("tagid")]
    public int TagId { get; set; }
    /// <summary>
    /// Tên thẻ, giới hạn độ dài trong 32 ký tự (ký tự tiếng Trung hoặc chữ cái tiếng Anh), tên thẻ không được trùng với các thẻ khác.
    /// </summary>
    [NotNull]
    [StringLength(32)]
    [JsonProperty("tagname")]
    [JsonPropertyName("tagname")]
    public string TagName { get; set; }
    public WeChatWorkTagUpdateRequest(int tagId, string tagName)
    {
        TagId = Check.Positive(tagId, nameof(tagId));
        TagName = Check.NotNullOrWhiteSpace(tagName, nameof(tagName), 32);
    }
}
