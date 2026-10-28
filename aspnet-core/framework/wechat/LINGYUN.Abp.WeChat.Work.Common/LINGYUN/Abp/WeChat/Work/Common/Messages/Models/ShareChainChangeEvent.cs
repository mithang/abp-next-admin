using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện ứng dụng được chia sẻ giữa thượng nguồn và hạ nguồn
/// </summary>
/// <remarks>
/// Thời điểm kích hoạt sự kiện này là:
/// 1. Doanh nghiệp thượng nguồn chia sẻ ứng dụng tự xây cho doanh nghiệp hạ nguồn sử dụng
/// 2. Doanh nghiệp thượng nguồn loại doanh nghiệp hạ nguồn khỏi ứng dụng được chia sẻ
/// </remarks>
[EventName("share_chain_change")]
public class ShareChainChangeEvent : WeChatWorkEventMessage
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ShareChainChangeEvent>(this);
    }
}
