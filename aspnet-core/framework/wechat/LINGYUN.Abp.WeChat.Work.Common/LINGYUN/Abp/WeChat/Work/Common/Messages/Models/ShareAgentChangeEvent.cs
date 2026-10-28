using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện ứng dụng được chia sẻ liên doanh nghiệp
/// </summary>
/// <remarks>
/// Thời điểm kích hoạt sự kiện này là:
/// 1. Doanh nghiệp cấp trên chia sẻ ứng dụng tự xây cho doanh nghiệp cấp dưới sử dụng
/// 2. Doanh nghiệp cấp trên loại doanh nghiệp cấp dưới khỏi ứng dụng được chia sẻ
/// </remarks>
[EventName("share_agent_change")]
public class ShareAgentChangeEvent : WeChatWorkEventMessage
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ShareAgentChangeEvent>(this);
    }
}
