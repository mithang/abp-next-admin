using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện khi nhấn menu để lấy thông báo
/// </summary>
[EventName("custom_menu")]
public class CustomMenuPushEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<CustomMenuPushEvent>(this);
    }
}
