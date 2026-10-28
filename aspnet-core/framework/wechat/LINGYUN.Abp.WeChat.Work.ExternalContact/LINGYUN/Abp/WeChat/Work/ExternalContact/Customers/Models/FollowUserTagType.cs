using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Loại nhãn
/// </summary>
[Description("Loại nhãn")]
public enum FollowUserTagType
{
    /// <summary>
    /// Cài đặt doanh nghiệp
    /// </summary>
    [Description("Cài đặt doanh nghiệp")]
    EnterpriseSettings = 1,
    /// <summary>
    /// Người dùng tùy chỉnh
    /// </summary>
    [Description("Người dùng tùy chỉnh")]
    UserCustom = 2,
    /// <summary>
    /// Nhãn nhóm quy tắc
    /// </summary>
    [Description("Nhãn nhóm quy tắc")]
    RuleGroupTags = 3,
}
