using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Sự kiện xóa khách hàng doanh nghiệp
/// </summary>
[EventName("external_contact_delete")]
public class ExternalContactDeleteEvent : ExternalContactChangeEvent
{
    /// <summary>
    /// Nguồn thao tác xóa khách hàng, DELETE_BY_TRANSFER nghĩa là khách hàng này bị thành viên tiếp nhận xóa tự động do kế thừa khi đang tại chức
    /// </summary>
    [XmlElement("Source")]
    public string Source { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalContactDeleteEvent>(this);
    }
}
