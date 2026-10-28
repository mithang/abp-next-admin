using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Services.Models;
public abstract class MessageModel : WeChatRequest
{
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    [JsonProperty("msgtype")]
    [JsonPropertyName("msgtype")]
    public string MsgType { get; } = default!;
    protected MessageModel(string msgType)
    {
        MsgType = msgType;
    }
}
