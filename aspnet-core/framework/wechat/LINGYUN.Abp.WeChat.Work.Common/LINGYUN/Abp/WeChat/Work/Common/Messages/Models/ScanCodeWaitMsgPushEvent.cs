using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện quét mã kèm hộp thoại nhắc “Đang nhận tin nhắn”
/// </summary>
[EventName("scancode_waitmsg")]
public class ScanCodeWaitMsgPushEvent : ScanCodeEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ScanCodeWaitMsgPushEvent>(this);
    }
}
