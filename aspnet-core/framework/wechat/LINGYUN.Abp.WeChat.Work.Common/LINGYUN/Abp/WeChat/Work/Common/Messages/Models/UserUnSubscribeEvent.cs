using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện người dùng hủy theo dõi
/// </summary>
[EventName("user_un_subscribe")]
public class UserUnSubscribeEvent : WeChatWorkEventMessage
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<UserUnSubscribeEvent>(this);
    }
}
