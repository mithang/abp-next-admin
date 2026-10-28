using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thay đổi nhãn khách hàng doanh nghiệp
/// </summary>
[EventName("change_external_tag_update")]
public class ExternalTagUpdateEvent : ExternalTagChangeEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalTagUpdateEvent>(this);
    }
}
