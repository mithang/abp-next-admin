using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu hướng dẫn chuyển hướng
/// </summary>
public class TemplateCardJump
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardJump(string title, string url)
    {
        Type = 1;
        Url = url;
        Title = title;
    }
    public TemplateCardJump(string title, string appid, string pagePath)
    {
        Type = 2;
        AppId = appid;
        PagePath = pagePath;
        Title = title;
    }
    /// <summary>
    /// Loại liên kết chuyển hướng: 0 hoặc không điền nghĩa là không phải liên kết, 1 nghĩa là chuyển đến url, 2 nghĩa là chuyển đến chương trình nhỏ (mini program)
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; }
    /// <summary>
    /// Nội dung văn bản của kiểu liên kết chuyển hướng, nên không quá 18 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; }
    /// <summary>
    /// url của liên kết chuyển hướng, bắt buộc khi jump_list.type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// appid của chương trình nhỏ trong liên kết chuyển hướng, phải là chương trình nhỏ liên kết với ứng dụng hiện tại, bắt buộc khi jump_list.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string? AppId { get; set; }
    /// <summary>
    /// pagepath của chương trình nhỏ trong liên kết chuyển hướng, tuỳ chọn khi jump_list.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string? PagePath { get; set; }
}
