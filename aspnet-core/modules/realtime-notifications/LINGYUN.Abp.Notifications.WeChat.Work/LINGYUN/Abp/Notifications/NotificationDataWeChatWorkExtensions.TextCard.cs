using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;

public static partial class NotificationDataWeChatWorkExtensions
{
    private const string TextCardMessage = Prefix + "text_card_message";

    /// <summary>
    /// Thông báo tin nhắn thẻ
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="textCardMessage">Tin nhắn thẻ</param>
    public static void WithTextCardMessage(
        this NotificationData notificationData,
        TextCardMessage textCardMessage)
    {
        notificationData.TrySetData(TextCardMessage, JsonConvert.SerializeObject(textCardMessage));
    }

    /// <summary>
    /// Thử lấy tin nhắn thẻ
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="textCardMessage"></param>
    /// <returns></returns>
    public static bool TryGetTextCardMessage(
        this NotificationData notificationData,
        out TextCardMessage? textCardMessage)
    {
        return notificationData.TryGetMessagePayload(TextCardMessage, out textCardMessage);
    }
}
