using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;
public static partial class NotificationDataWeChatWorkExtensions
{
    private const string MpNewMessage = Prefix + "mp_new_message";

    /// <summary>
    /// Tin nhắn hình ảnh và văn bản
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="mpNewMessagePayload">Đối tượng mang tin nhắn hình ảnh và văn bản (mp)</param>
    public static void WithMpNewMessage(
        this NotificationData notificationData,
        MpNewMessagePayload mpNewMessagePayload)
    {
        notificationData.TrySetData(MpNewMessage, JsonConvert.SerializeObject(mpNewMessagePayload));
    }

    /// <summary>
    /// Thử lấy tin nhắn hình ảnh và văn bản
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="workMiniProgramMessage"></param>
    /// <returns></returns>
    public static bool TryGetMpNewMessage(
        this NotificationData notificationData,
        out MpNewMessagePayload? mpNewMessagePayload)
    {
        return notificationData.TryGetMessagePayload(MpNewMessage, out mpNewMessagePayload);
    }
}
