using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages;
/// <summary>
/// Thông báo thường WeChat Work
/// </summary>
public abstract class WeChatWorkGeneralMessage : WeChatGeneralMessage
{
    /// <summary>
    /// ID của ứng dụng doanh nghiệp, kiểu số nguyên. Có thể xem tại trang cài đặt của ứng dụng
    /// </summary>
    [XmlElement("AgentID")]
    public int AgentId { get; set; }
}
