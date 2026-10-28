using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thay đổi khách hàng doanh nghiệp
/// </summary>
public abstract class ExternalContactChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Loại thay đổi
    /// </summary>
    [XmlElement("ChangeType")]
    public string ChangeType { get; set; } = default!;
    /// <summary>
    /// UserID của nhân viên phục vụ doanh nghiệp
    /// </summary>
    [XmlElement("UserID")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// userid của liên hệ bên ngoài, lưu ý không phải tài khoản thành viên doanh nghiệp
    /// </summary>
    [XmlElement("ExternalUserID")]
    public string ExternalUserId { get; set; } = default!;
}
