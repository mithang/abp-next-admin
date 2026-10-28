using LINGYUN.Abp.WeChat.Work.Chat.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Chat.Response;
public class WeChatWorkAppChatInfoResponse : WeChatWorkResponse
{
    /// <summary>
    /// Thông tin nhóm trò chuyện
    /// </summary>
    [JsonProperty("chat_info")]
    [JsonPropertyName("chat_info")]
    public WeChatWorkAppChatInfo ChatInfo { get; set; } = default!;
}
