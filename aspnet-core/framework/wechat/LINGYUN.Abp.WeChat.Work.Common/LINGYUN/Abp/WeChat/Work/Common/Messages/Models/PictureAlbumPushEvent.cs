using LINGYUN.Abp.WeChat.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện bật chụp ảnh hoặc gửi ảnh từ album
/// </summary>
[EventName("pic_photo_or_album")]
public class PictureAlbumPushEvent : PicturePushEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<PictureAlbumPushEvent>(this);
    }
}