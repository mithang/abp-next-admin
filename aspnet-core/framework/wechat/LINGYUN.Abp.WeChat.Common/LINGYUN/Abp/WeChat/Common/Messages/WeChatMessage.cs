using System;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Common.Messages;
/// <summary>
/// Tin nhắn WeChat
/// </summary>
[Serializable]
[XmlRoot("xml")]
public abstract class WeChatMessage
{
    /// <summary>
    /// Tài khoản WeChat của nhà phát triển
    /// </summary>
    [XmlElement("ToUserName")]
    public string ToUserName { get; set; } = default!;
    /// <summary>
    /// Tài khoản của bên gửi (một OpenID)
    /// </summary>
    [XmlElement("FromUserName")]
    public string FromUserName { get; set; } = default!;
    /// <summary>
    /// Thời gian tạo tin nhắn (số nguyên)
    /// </summary>
    [XmlElement("CreateTime")]
    public int CreateTime { get; set; }
    /// <summary>
    /// Loại tin nhắn, event
    /// </summary>
    [XmlElement("MsgType")]
    public string MsgType { get; set; } = default!;

    public abstract WeChatMessageEto ToEto();

    public virtual string SerializeToJson()
    {
        return WeChatObjectSerializeExtensions.SerializeToJson(this);
    }

    public virtual string SerializeToXml()
    {
        return this.SerializeWeChatMessage();
    }
}
