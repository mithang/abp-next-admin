namespace LINGYUN.Abp.DataProtection.Models;

public class EntityPropertyInfoModel
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public string DisplayName { get; set; } = default!;
    /// <summary>
    /// Tên đầy đủ của kiểu
    /// </summary>
    public string TypeFullName { get; set; } = default!;
    /// <summary>
    /// Kiểu JavaScript
    /// </summary>
    public string JavaScriptType { get; set; } = default!;
    /// <summary>
    /// Tên JavaScript
    /// </summary>
    public string JavaScriptName { get; set; } = default!;
    /// <summary>
    /// Danh sách enum
    /// </summary>
    public EntityEnumInfoModel[]? Enums { get; set; }
    /// <summary>
    /// Danh sách các thao tác lọc được phép
    /// </summary>
    public DataAccessFilterOperate[]? Operates { get; set; }
}
