using LINGYUN.Abp.WeChat.Common;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat;
/// <summary>
/// Phản hồi yêu cầu WeChat
/// </summary>
[Serializable]
public class WeChatResponse
{
    /// <summary>
    /// Mã lỗi
    /// </summary>
    [JsonProperty("errcode")]
    [JsonPropertyName("errcode")]
    public int ErrorCode { get; set; }
    /// <summary>
    /// Tin nhắn lỗi
    /// </summary>
    [JsonProperty("errmsg")]
    [JsonPropertyName("errmsg")]
    public string? ErrorMessage { get; set; }

    public bool IsSuccessed => ErrorCode == 0;

    public void ThrowIfNotSuccess()
    {
        if (ErrorCode != 0)
        {
            throw new AbpWeChatException($"WeChat:{ErrorCode}", $"Wechat work request error:{ErrorMessage}");
        }
    }
}
