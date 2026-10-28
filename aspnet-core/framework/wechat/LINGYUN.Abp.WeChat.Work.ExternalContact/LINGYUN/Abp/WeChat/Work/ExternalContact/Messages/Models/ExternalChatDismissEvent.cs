using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện giải tán nhóm khách hàng
/// </summary>
[EventName("external_chat_dismiss")]
public class ExternalChatDismissEvent : ExternalChatChangeEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ExternalChatDismissEvent>(this);
    }
}
