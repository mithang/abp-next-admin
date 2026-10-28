using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;

public static partial class NotificationDataWeChatWorkExtensions
{
    private const string VideoMessage = Prefix + "video_message";

    /// <summary>
    /// Thông báo tin nhắn video
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="videoMessage">Tin nhắn video</param>
    public static void WithVideoMessage(
        this NotificationData notificationData,
        VideoMessage videoMessage)
    {
        notificationData.TrySetData(VideoMessage, JsonConvert.SerializeObject(videoMessage));
    }

    /// <summary>
    /// Thử lấy tin nhắn video
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="videoMessage"></param>
    /// <returns></returns>
    public static bool TryGetVideoMessage(
        this NotificationData notificationData,
        out VideoMessage? videoMessage)
    {
        return notificationData.TryGetMessagePayload(VideoMessage, out videoMessage);
    }
}
