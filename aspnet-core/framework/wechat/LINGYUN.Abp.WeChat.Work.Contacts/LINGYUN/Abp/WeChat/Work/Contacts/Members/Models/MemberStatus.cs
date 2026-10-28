using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Trạng thái kích hoạt
/// </summary>
[Description("Trạng thái kích hoạt")]
public enum MemberStatus
{
    /// <summary>
    /// Đã kích hoạt
    /// </summary>
    [Description("Đã kích hoạt")]
    Activated = 1,
    /// <summary>
    /// Đã vô hiệu hóa
    /// </summary>
    [Description("Đã vô hiệu hóa")]
    Disabled = 2,
    /// <summary>
    /// Chưa kích hoạt
    /// </summary>
    [Description("Chưa kích hoạt")]
    NotActivated = 4,
    /// <summary>
    /// Rời khỏi doanh nghiệp
    /// </summary>
    [Description("Rời khỏi doanh nghiệp")]
    Exited = 5,
}
