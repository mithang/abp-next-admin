namespace LINGYUN.Abp.WeChat.Work.JsSdk.Models;
public class JsApiTicketInfo
{
    /// <summary>
    /// jsapi_ticket cần để tạo chữ ký, dài tối đa 512 byte
    /// </summary>
    public string Ticket { get; set; } = default!;
    /// <summary>
    /// Thời gian hiệu lực của chứng thực (giây)
    /// </summary>
    public int ExpiresIn { get; set; }
    public JsApiTicketInfo()
    {

    }

    public JsApiTicketInfo(string ticket, int expiresIn)
    {
        Ticket = ticket;
        ExpiresIn = expiresIn;
    }
}
