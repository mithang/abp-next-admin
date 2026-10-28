using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thêm khách hàng doanh nghiệp
/// </summary>
[EventName("external_contact_create")]
public class ExternalContactCreateEvent : ExternalContactChangeEvent
{
    /// <summary>
    /// Tham số state được cấu hình trong phương thức 'Liên hệ tôi' khi thêm người dùng này, hoặc tham số customer_channel được chỉ định trong liên kết thu hút khách hàng, có thể dùng để nhận biết kênh thêm người dùng này
    /// </summary>
    [XmlElement("State")]
    public string State { get; set; } = default!;
    /// <summary>
    /// Mã lời chào mừng, có thể dùng để gửi lời chào mừng
    /// </summary>
    [XmlElement("WelcomeCode")]
    public string WelcomeCode { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalContactCreateEvent>(this);
    }
}
