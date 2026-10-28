using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Sự kiện tiếp nhận khách hàng thất bại
/// </summary>
[EventName("external_contact_transfer_fail")]
public class ExternalContactTransferFailEvent : ExternalContactChangeEvent
{
    /// <summary>
    /// Nguyên nhân tiếp nhận thất bại, customer_refused - khách hàng từ chối, customer_limit_exceed - số lượng khách hàng của thành viên tiếp nhận đã đạt giới hạn
    /// </summary>
    [XmlElement("FailReason")]
    public string FailReason { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalContactTransferFailEvent>(this);
    }
}
