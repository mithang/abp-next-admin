using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Thuộc tính thành viên loại trang web
/// </summary>
public class MemberWebAttribute : MemberAttribute
{
    /// <summary>
    /// Trang web
    /// </summary>
    [NotNull]
    [JsonProperty("web")]
    [JsonPropertyName("web")]
    public MemberWebModel Web { get; set; } = default!;
}

public class MemberWebModel
{
    /// <summary>
    /// url của trang web, phải chứa tiền tố http hoặc https
    /// </summary>
    [NotNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; } = default!;
    /// <summary>
    /// Tiêu đề hiển thị của trang web, giới hạn độ dài 12 ký tự UTF8
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = default!;
}
