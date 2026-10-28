using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Nút thao tác trên thẻ
/// </summary>
public class TemplateCardAction
{
    public TemplateCardAction(string key, string text)
    {
        Key = key;
        Text = text;
    }

    /// <summary>
    /// Giá trị key của thao tác; sau khi người dùng nhấn, sự kiện gọi lại sẽ trả về tham số này dưới dạng EventKey, sự kiện gọi lại sẽ mang theo key này, hỗ trợ tối đa 1024 byte, không được trùng lặp
    /// </summary>
    [NotNull]
    [JsonProperty("key")]
    [JsonPropertyName("key")]
    public string Key { get; set; }
    /// <summary>
    /// Văn bản mô tả thao tác
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; }
}