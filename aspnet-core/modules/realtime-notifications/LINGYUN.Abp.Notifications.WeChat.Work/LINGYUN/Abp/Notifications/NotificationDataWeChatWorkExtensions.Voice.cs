using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;

public static partial class NotificationDataWeChatWorkExtensions
{
    private const string VoiceMessage = Prefix + "voice_message";

    /// <summary>
    /// Thông báo tin nhắn ngôn ngữ
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="voiceMessage">Tin nhắn ngôn ngữ</param>
    public static void WithVoiceMessage(
        this NotificationData notificationData,
        MediaMessage voiceMessage)
    {
        notificationData.TrySetData(VoiceMessage, JsonConvert.SerializeObject(voiceMessage));
    }

    /// <summary>
    /// Thử lấy tin nhắn ngôn ngữ
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="voiceMessage"></param>
    /// <returns></returns>
    public static bool TryGetVoiceMessage(
        this NotificationData notificationData,
        out MediaMessage? voiceMessage)
    {
        return notificationData.TryGetMessagePayload(VoiceMessage, out voiceMessage);
    }
}
