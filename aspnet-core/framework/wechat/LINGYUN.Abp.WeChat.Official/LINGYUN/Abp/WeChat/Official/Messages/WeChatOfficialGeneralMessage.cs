using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Messages;
public abstract class WeChatOfficialGeneralMessage : WeChatGeneralMessage
{
    /// <summary>
    /// ID dữ liệu của thông báo (chỉ có khi thông báo đến từ bài viết)
    /// </summary>
    [XmlElement("MsgDataId")]
    public string? MsgDataId { get; set; }
    /// <summary>
    /// Bài viết thứ mấy khi có nhiều bài viết kèm hình ảnh, bắt đầu từ 1 (chỉ có khi thông báo đến từ bài viết)
    /// </summary>
    [XmlElement("Idx")]
    public string? Idx { get; set; }
}
