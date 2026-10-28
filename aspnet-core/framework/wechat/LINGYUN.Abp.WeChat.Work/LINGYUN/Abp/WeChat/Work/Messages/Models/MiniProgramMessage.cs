using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thông báo của mini program
/// </summary>
public class MiniProgramMessage
{
    /// <summary>
    /// appid của mini program, phải là mini program liên kết với ứng dụng hiện tại
    /// </summary>
    [NotNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string AppId { get; set; } = default!;
    /// <summary>
    /// Tiêu đề thông báo, giới hạn độ dài 4-12 ký tự tiếng Trung (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// Trang mini program sau khi nhấn vào thẻ thông báo, tối đa 1024 byte, chỉ giới hạn các trang trong mini program này. Nếu không điền trường này thì khi nhấn vào thông báo sẽ không chuyển trang.
    /// </summary>
    [CanBeNull]
    [JsonProperty("page")]
    [JsonPropertyName("page")]
    public string? Page { get; set; }
    /// <summary>
    /// Mô tả thông báo, giới hạn độ dài 4-12 ký tự tiếng Trung (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Có phóng to content_item đầu tiên hay không
    /// </summary>
    [CanBeNull]
    [JsonProperty("emphasis_first_item")]
    [JsonPropertyName("emphasis_first_item")]
    public bool? EmphasisFirstItem { get; set; }
    /// <summary>
    /// Cặp khóa-giá trị của nội dung thông báo, tối đa cho phép 10 item
    /// </summary>
    [CanBeNull]
    [JsonProperty("content_item")]
    [JsonPropertyName("content_item")]
    public List<MiniProgramContent>? ContentItems { get; set; }

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public MiniProgramMessage(
        string appId,
        string title,
        string? page = null, 
        string? description = null, 
        bool? emphasisFirstItem = null)
    {
        AppId = appId;
        Page = page;
        Title = title;
        Description = description;
        EmphasisFirstItem = emphasisFirstItem;
    }
}

public class MiniProgramContent
{
    /// <summary>
    /// Độ dài trong 10 ký tự tiếng Trung
    /// </summary>
    [NotNull]
    [JsonProperty("key")]
    [JsonPropertyName("key")]
    public string Key { get; set; } = default!;
    /// <summary>
    /// Độ dài trong 30 ký tự tiếng Trung (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string Value { get; set; } = default!;

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public MiniProgramContent(string key, string value)
    {
        Key = key;
        Value = value;
    }
}
