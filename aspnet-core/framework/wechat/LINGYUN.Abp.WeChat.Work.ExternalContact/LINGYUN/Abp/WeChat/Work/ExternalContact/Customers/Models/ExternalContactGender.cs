using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Giới tính liên hệ bên ngoài
/// </summary>
[Description("Giới tính liên hệ bên ngoài")]
public enum ExternalContactGender
{
    /// <summary>
    /// Không xác định
    /// </summary>
    [Description("Không xác định")]
    None = 0,
    /// <summary>
    /// Nam
    /// </summary>
    [Description("Nam")]
    Male = 1,
    /// <summary>
    /// Nữ
    /// </summary>
    [Description("Nữ")]
    FeMale = 2,
}
