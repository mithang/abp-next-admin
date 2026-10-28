using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Sự kiện quét mã QR có tham số
/// </summary>
[EventName("parametric_qr_code")]
public class ParametricQrCodeEvent : WeChatEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    /// <summary>
    /// ticket của mã QR, có thể dùng để đổi lấy hình ảnh mã QR
    /// </summary>
    [XmlElement("Ticket")]
    public string Ticket { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialEventMessageEto<ParametricQrCodeEvent>(this);
    }
}
