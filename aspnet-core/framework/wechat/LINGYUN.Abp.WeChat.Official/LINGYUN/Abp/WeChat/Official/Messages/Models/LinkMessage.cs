using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Tin nhắn liên kết
/// </summary>
[EventName("link")]
public class LinkMessage : WeChatOfficialGeneralMessage
{
    /// <summary>
    /// Tiêu đề tin nhắn
    /// </summary>
    [XmlElement("Title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// Mô tả tin nhắn
    /// </summary>
    [XmlElement("Description")]
    public string? Description { get; set; }
    /// <summary>
    /// Liên kết tin nhắn
    /// </summary>
    [XmlElement("Url")]
    public string Url { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialGeneralMessageEto<LinkMessage>(this);
    }
}
