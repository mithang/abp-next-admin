using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện vào ứng dụng
/// </summary>
[EventName("enter_agent")]
public class EnterAgentEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<EnterAgentEvent>(this);
    }
}
