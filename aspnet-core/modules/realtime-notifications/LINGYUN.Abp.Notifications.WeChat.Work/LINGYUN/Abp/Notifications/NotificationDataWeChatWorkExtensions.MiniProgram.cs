using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;

public static partial class NotificationDataWeChatWorkExtensions
{
    private const string MiniProgramMessage = Prefix + "mini_program_message";

    /// <summary>
    /// Thông báo Mini Program
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="miniProgramMessage">Tin nhắn thông báo Mini Program</param>
    public static void WithMiniProgramMessage(
        this NotificationData notificationData,
        MiniProgramMessage miniProgramMessage)
    {
        notificationData.TrySetData(MiniProgramMessage, JsonConvert.SerializeObject(miniProgramMessage));
    }

    /// <summary>
    /// Thử lấy tin nhắn Mini Program
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="workMiniProgramMessage"></param>
    /// <returns></returns>
    public static bool TryGetMiniProgramMessage(
        this NotificationData notificationData,
        out MiniProgramMessage? miniProgramMessage)
    {
        return notificationData.TryGetMessagePayload(MiniProgramMessage, out miniProgramMessage);
    }
}
