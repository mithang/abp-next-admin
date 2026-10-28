using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Tin nhắn video
/// </summary>
[EventName("video")]
public class VideoMessage : WeChatOfficialGeneralMessage
{
    /// <summary>
    /// Id media của hình thu nhỏ tin nhắn video, có thể gọi giao diện tải xuống tệp đa phương tiện để lấy dữ liệu.
    /// </summary>
    [XmlElement("ThumbMediaId")]
    public string ThumbMediaId { get; set; } = default!;
    /// <summary>
    /// Id media của tin nhắn video, có thể gọi giao diện lấy tài liệu tạm thời để lấy dữ liệu.
    /// </summary>
    [XmlElement("MediaId")]
    public string MediaId { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialGeneralMessageEto<VideoMessage>(this);
    }
}
