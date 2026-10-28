using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Chat.Response;

public class WeChatWorkAppChatCreateResponse : WeChatWorkResponse
{
    /// <summary>
    /// Định danh duy nhất của nhóm trò chuyện
    /// </summary>
    [JsonProperty("chatid")]
    [JsonPropertyName("chatid")]
    public virtual string ChatId { get; set; } = default!;
}
