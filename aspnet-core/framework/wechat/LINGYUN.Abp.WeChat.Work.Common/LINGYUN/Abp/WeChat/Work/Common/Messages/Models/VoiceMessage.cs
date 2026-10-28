using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Tin nhắn thoại
/// </summary>
[EventName("voice")]
public class VoiceMessage : WeChatWorkGeneralMessage
{
    /// <summary>
    /// Định dạng thoại, ví dụ amr, speex, v.v.
    /// </summary>
    [XmlElement("Format")]
    public string Format { get; set; } = default!;
    /// <summary>
    /// id phương tiện của tin nhắn thoại, có thể gọi giao diện lấy tài nguyên tạm thời để lấy phương tiện này
    /// </summary>
    [XmlElement("MediaId")]
    public string MediaId { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkGeneralMessageEto<VoiceMessage>(this);
    }
}
