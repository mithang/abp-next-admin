using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Thông báo văn bản
/// </summary>
[EventName("text")]
public class TextMessage : WeChatWorkGeneralMessage
{
    /// <summary>
    /// Nội dung thông báo văn bản
    /// </summary>
    [XmlElement("Content")]
    public string Content { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkGeneralMessageEto<TextMessage>(this);
    }
}
