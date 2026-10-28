using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Services.Models;
/// <summary>
/// Gửi tin nhắn văn bản
/// </summary>
[Serializable]
public class TextMessageModel : MessageModel
{
    /// <summary>
    /// Người dùng nhận tin nhắn
    /// </summary>
    [JsonProperty("touser")]
    [JsonPropertyName("touser")]
    public string ToUser { get; }
    /// <summary>
    /// Nội dung tin nhắn
    /// </summary>
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public TextMessage Text { get; }
    public TextMessageModel(string toUser, TextMessage text)
        : base("text")
    {
        ToUser = toUser;
        Text = text;
    }
}

public class TextMessage
{
    /// <summary>
    /// Văn bản nội dung
    /// </summary>
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; }
    public TextMessage(string content)
    {
        Content = content;
    }
}
