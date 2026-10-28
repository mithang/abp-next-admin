using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thay đổi thẻ khách hàng doanh nghiệp
/// </summary>
public abstract class ExternalTagChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Loại thay đổi
    /// </summary>
    [XmlElement("ChangeType")]
    public string ChangeType { get; set; } = default!;
    /// <summary>
    /// Id nhóm quy tắc mà thẻ hoặc nhóm thẻ thuộc về, chỉ gọi lại cho ứng dụng “Liên hệ khách hàng”
    /// </summary>
    [XmlElement("StrategyId")]
    public string StrategyId { get; set; } = default!;
}
