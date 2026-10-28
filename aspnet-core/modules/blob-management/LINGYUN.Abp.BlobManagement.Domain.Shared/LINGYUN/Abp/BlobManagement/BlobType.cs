using System.ComponentModel;

namespace LINGYUN.Abp.BlobManagement;

/// <summary>
/// Loại đối tượng
/// </summary>
[Description("Loại đối tượng")]
public enum BlobType
{
    /// <summary>
    /// Thư mục
    /// </summary>
    [Description("Thư mục")]
    Folder = 0,
    /// <summary>
    /// Tệp
    /// </summary>
    [Description("Tệp")]
    File = 1
}
