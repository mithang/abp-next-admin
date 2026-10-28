using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Thông điệp hình ảnh
/// </summary>
[EventName("picture")]
public class PictureMessage : WeChatWorkGeneralMessage
{
    /// <summary>
    /// Liên kết hình ảnh (do hệ thống tạo)
    /// </summary>
    [XmlElement("PicUrl")]
    public string PicUrl { get; set; } = default!;
    /// <summary>
    /// Id media của thông điệp hình ảnh, có thể gọi giao diện lấy tài nguyên tạm thời để lấy dữ liệu.
    /// </summary>
    [XmlElement("MediaId")]
    public string MediaId { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkGeneralMessageEto<PictureMessage>(this);
    }
}
