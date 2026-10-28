using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện bật trình gửi ảnh từ album WeChat
/// </summary>
[EventName("pic_weixin")]
public class PictureWeixinPushEvent : PicturePushEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<PictureWeixinPushEvent>(this);
    }
}