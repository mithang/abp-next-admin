using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thay đổi nhóm khách hàng
/// </summary>
public abstract class ExternalChatChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Loại thay đổi
    /// </summary>
    [XmlElement("ChangeType")]
    public string ChangeType { get; set; } = default!;
    /// <summary>
    /// Id nhóm
    /// </summary>
    [XmlElement("ChatId")]
    public string ChatId { get; set; } = default!;
}

