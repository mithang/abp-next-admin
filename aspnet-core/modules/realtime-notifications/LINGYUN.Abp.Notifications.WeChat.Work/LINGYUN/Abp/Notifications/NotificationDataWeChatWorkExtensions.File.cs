using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;

public static partial class NotificationDataWeChatWorkExtensions
{
    private const string FileMessage = Prefix + "file_message";

    /// <summary>
    /// Thông báo tin nhắn tệp
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="fileMessage">Tin nhắn tệp</param>
    public static void WithFileMessage(
        this NotificationData notificationData,
        MediaMessage fileMessage)
    {
        notificationData.TrySetData(FileMessage, JsonConvert.SerializeObject(fileMessage));
    }

    /// <summary>
    /// Thử lấy tin nhắn tệp
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="fileMessage"></param>
    /// <returns></returns>
    public static bool TryGetFileMessage(
        this NotificationData notificationData,
        out MediaMessage? fileMessage)
    {
        return notificationData.TryGetMessagePayload(FileMessage, out fileMessage);
    }
}
