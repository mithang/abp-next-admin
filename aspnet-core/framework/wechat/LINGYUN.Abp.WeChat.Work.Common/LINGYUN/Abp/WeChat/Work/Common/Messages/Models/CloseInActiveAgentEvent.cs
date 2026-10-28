using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện tạm dừng ứng dụng do không sử dụng trong thời gian dài
/// </summary>
[EventName("close_inactive_agent")]
public class CloseInActiveAgentEvent : WeChatWorkEventMessage
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<CloseInActiveAgentEvent>(this);
    }
}
