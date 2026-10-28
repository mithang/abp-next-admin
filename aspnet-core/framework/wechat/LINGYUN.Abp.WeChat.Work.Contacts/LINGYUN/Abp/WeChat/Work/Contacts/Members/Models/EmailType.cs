using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Loại hộp thư
/// </summary>
[Description("Loại hộp thư")]
public enum EmailType
{
    /// <summary>
    /// Hộp thư doanh nghiệp
    /// </summary>
    [Description("Hộp thư doanh nghiệp")]
    BizEmail = 1,
    /// <summary>
    /// Hộp thư cá nhân
    /// </summary>
    [Description("Hộp thư cá nhân")]
    PersonEmail = 2,
}
