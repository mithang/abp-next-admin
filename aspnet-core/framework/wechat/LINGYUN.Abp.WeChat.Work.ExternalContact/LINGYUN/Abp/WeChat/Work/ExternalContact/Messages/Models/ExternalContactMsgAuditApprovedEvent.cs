using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện khách hàng đồng ý lưu trữ nội dung trò chuyện
/// </summary>
[EventName("external_contact_msg_audit_approved")]
public class ExternalContactMsgAuditApprovedEvent : ExternalContactChangeEvent
{
    /// <summary>
    /// Mã lời chào, có thể dùng để gửi lời chào
    /// </summary>
    [XmlElement("WelcomeCode")]
    public string WelcomeCode { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalContactMsgAuditApprovedEvent>(this);
    }
}
