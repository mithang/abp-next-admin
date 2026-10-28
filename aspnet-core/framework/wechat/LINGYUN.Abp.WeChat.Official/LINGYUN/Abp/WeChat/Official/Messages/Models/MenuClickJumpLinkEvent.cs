using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Đẩy sự kiện khi nhấn menu để chuyển đến liên kết
/// </summary>
[EventName("menu_click_jump_link")]
public class MenuClickJumpLinkEvent : WeChatEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialEventMessageEto<MenuClickJumpLinkEvent>(this);
    }
}
