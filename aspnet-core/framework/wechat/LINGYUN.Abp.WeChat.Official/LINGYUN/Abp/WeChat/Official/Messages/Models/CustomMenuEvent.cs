using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Sự kiện menu tùy chỉnh
/// </summary>
[EventName("custom_menu")]
public class CustomMenuEvent : WeChatEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialEventMessageEto<CustomMenuEvent>(this);
    }
}
