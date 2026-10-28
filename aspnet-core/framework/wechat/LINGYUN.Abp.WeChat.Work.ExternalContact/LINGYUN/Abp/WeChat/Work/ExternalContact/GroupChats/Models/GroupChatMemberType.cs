using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Loại thành viên
/// </summary>
[Description("Loại thành viên")]
public enum GroupChatMemberType
{
    /// <summary>
    /// Thành viên doanh nghiệp
    /// </summary>
    [Description("Thành viên doanh nghiệp")]
    Internal = 1,
    /// <summary>
    /// Liên hệ bên ngoài
    /// </summary>
    [Description("Liên hệ bên ngoài")]
    External = 2
}
