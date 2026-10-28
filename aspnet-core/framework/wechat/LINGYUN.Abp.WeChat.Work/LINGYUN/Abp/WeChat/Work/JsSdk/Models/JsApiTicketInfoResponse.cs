using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.JsSdk.Models;

public class JsApiTicketInfoResponse : WeChatWorkResponse
{
    /// <summary>
    /// jsapi_ticket cần để tạo chữ ký, dài tối đa 512 byte
    /// </summary>
    [JsonProperty("ticket")]
    [JsonPropertyName("ticket")]
    public string Ticket { get; set; } = default!;
    /// <summary>
    /// Thời gian hiệu lực của chứng thực (giây)
    /// </summary>
    [JsonProperty("expires_in")]
    [JsonPropertyName("expires_in")]
    [System.Text.Json.Serialization.JsonConverter(typeof(NumberToStringConverter))]
    public int ExpiresIn { get; set; }

    public JsApiTicketInfo ToJsApiTicket()
    {
        ThrowIfNotSuccess();
        return new JsApiTicketInfo(Ticket, ExpiresIn);
    }
}
