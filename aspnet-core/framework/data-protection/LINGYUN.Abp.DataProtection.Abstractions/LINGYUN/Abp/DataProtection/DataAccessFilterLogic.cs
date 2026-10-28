using System.ComponentModel;

namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Cách kết nối bộ lọc dữ liệu
/// </summary>
public enum DataAccessFilterLogic
{
    /// <summary>
    /// Và
    /// </summary>
    [Description("Và")]
    And,
    /// <summary>
    /// Hoặc
    /// </summary>
    [Description("Hoặc")]
    Or
}