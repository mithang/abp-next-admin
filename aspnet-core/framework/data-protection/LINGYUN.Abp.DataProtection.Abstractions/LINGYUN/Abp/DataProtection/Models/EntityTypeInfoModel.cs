using System.Collections.Generic;

namespace LINGYUN.Abp.DataProtection.Models;

public class EntityTypeInfoModel
{
    /// <summary>
    /// Tên thực thể
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public string DisplayName { get; set; } = default!;
    /// <summary>
    /// Danh sách thuộc tính có thể truy cập
    /// </summary>
    public List<EntityPropertyInfoModel> Properties { get; set; } = new List<EntityPropertyInfoModel>();
}
