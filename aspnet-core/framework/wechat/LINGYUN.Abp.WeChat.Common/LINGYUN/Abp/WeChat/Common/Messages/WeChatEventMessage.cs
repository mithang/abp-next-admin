using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Common.Messages;
/// <summary>
/// Thông báo sự kiện WeChat
/// </summary>
public abstract class WeChatEventMessage : WeChatMessage
{
    /// <summary>
    /// Loại sự kiện
    /// </summary>
    [XmlElement("Event")]
    public string Event { get; set; } = default!;
}
