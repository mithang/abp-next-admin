using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện đổi tên nhóm khách hàng
/// </summary>
[EventName("external_chat_change_name")]
public class ExternalChatChangeNameEvent : ExternalChatUpdateEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalChatChangeNameEvent>(this);
    }
}
