using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Giới tính
/// </summary>
[Description("Giới tính")]
public enum Gender
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