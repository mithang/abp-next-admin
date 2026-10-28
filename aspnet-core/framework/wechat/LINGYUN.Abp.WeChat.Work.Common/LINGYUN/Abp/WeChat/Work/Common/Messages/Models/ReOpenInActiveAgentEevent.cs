using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện bật lại ứng dụng do không sử dụng trong thời gian dài
/// </summary>
[EventName("reopen_inactive_agent")]
public class ReOpenInActiveAgentEevent : WeChatWorkEventMessage
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ReOpenInActiveAgentEevent>(this);
    }
}