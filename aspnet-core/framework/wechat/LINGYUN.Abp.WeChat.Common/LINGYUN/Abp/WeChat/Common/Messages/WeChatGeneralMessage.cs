using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Common.Messages;
/// <summary>
/// Thông báo thường WeChat
/// </summary>
public abstract class WeChatGeneralMessage : WeChatMessage
{
    /// <summary>
    /// ID thông báo, số nguyên 64 bit
    /// </summary>
    [XmlElement("MsgId")]
    public long MsgId { get; set; }
}
