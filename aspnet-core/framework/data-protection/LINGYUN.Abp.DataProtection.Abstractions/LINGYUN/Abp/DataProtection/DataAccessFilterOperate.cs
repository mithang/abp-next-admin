using System.ComponentModel;

namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Thao tác lọc dữ liệu
/// </summary>
public enum DataAccessFilterOperate
{
    /// <summary>
    /// Bằng
    /// </summary>
    [Description("Bằng")]
    Equal = 1,
    /// <summary>
    /// Không bằng
    /// </summary>
    [Description("Không bằng")]
    NotEqual = 2,
    /// <summary>
    /// Nhỏ hơn
    /// </summary>
    [Description("Nhỏ hơn")]
    Less = 3,
    /// <summary>
    /// Nhỏ hơn hoặc bằng
    /// </summary>
    [Description("Nhỏ hơnBằng")]
    LessOrEqual = 4,
    /// <summary>
    /// Lớn hơn
    /// </summary>
    [Description("Lớn hơn")]
    Greater = 5,
    /// <summary>
    /// Lớn hơn hoặc bằng
    /// </summary>
    [Description("Lớn hơnBằng")]
    GreaterOrEqual = 6,
    /// <summary>
    /// Bắt đầu bằng
    /// </summary>
    [Description("Bắt đầu bằng")]
    StartsWith = 7,
    /// <summary>
    /// Kết thúc bằng
    /// </summary>
    [Description("Kết thúc bằng")]
    EndsWith = 8,
    /// <summary>
    /// Chứa
    /// </summary>
    [Description("Chứa")]
    Contains = 9,
    /// <summary>
    /// Không chứa
    /// </summary>
    [Description("Không chứa")]
    NotContains = 10,
}