using System.ComponentModel;

namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Thao tác dữ liệu
/// </summary>
public enum DataAccessOperation
{
    /// <summary>
    /// Truy vấn
    /// </summary>
    [Description("Truy vấn")]
    Read, 
    /// <summary>
    /// Cập nhật
    /// </summary>
    [Description("Cập nhật")]
    Write, 
    /// <summary>
    /// Xóa
    /// </summary>
    [Description("Xóa")]
    Delete
}
