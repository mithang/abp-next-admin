using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Notifications;

public static partial class NotificationDataWeChatWorkExtensions
{
    private const string TemplateCardMessage = Prefix + "template_card_message";

    /// <summary>
    /// Thông báo tin nhắn thẻ mẫu
    /// </summary>
    /// <param name="notificationData">Nội dung thông báo</param>
    /// <param name="templateCard">Tin nhắn thẻ mẫu</param>
    public static void WithTemplateCardMessage(
        this NotificationData notificationData,
        TemplateCard templateCard)
    {
        notificationData.TrySetData(TemplateCardMessage, JsonConvert.SerializeObject(templateCard));
    }

    /// <summary>
    /// Thử lấy tin nhắn thẻ mẫu
    /// </summary>
    /// <param name="notificationData"></param>
    /// <param name="textTemplateCard"></param>
    /// <returns></returns>
    public static bool TryGetTextTemplateCardMessage(
        this NotificationData notificationData,
        out TextTemplateCard? textTemplateCard)
    {
        return notificationData.TryGetMessagePayload(TemplateCardMessage, out textTemplateCard);
    }
}
