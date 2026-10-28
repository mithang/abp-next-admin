using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện chỉnh sửa khách hàng doanh nghiệp
/// </summary>
[EventName("external_contact_update")]
public class ExternalContactUpdateEvent : ExternalContactChangeEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalContactUpdateEvent>(this);
    }
}

