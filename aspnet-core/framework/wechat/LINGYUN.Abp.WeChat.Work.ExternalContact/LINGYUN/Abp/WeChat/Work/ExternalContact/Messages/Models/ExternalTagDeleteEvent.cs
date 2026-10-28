using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện xóa nhãn khách hàng doanh nghiệp
/// </summary>
[EventName("change_external_tag_delete")]
public class ExternalTagDeleteEvent : ExternalTagChangeEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalTagDeleteEvent>(this);
    }
}
