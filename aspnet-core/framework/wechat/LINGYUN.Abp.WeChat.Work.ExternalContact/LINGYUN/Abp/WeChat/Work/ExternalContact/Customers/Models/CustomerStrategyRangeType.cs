using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Loại nút
/// </summary>
[Description("Loại nút")]
public enum CustomerStrategyRangeType
{
    /// <summary>
    /// Thành viên
    /// </summary>
    [Description("Thành viên")]
    Member = 1,
    /// <summary>
    /// Phòng ban
    /// </summary>
    [Description("Phòng ban")]
    Part = 2
}
