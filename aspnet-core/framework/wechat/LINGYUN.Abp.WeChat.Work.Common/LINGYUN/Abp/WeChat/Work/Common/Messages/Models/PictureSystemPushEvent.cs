using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện bật chụp ảnh hệ thống để gửi ảnh
/// </summary>
[EventName("pic_sysphoto")]
public class PictureSystemPushEvent : PicturePushEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<PictureSystemPushEvent>(this);
    }
}
