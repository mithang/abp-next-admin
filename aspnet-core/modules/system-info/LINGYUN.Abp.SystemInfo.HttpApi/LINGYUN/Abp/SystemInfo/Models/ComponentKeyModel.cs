namespace LINGYUN.Abp.SystemInfo.Models;
/// <summary>
/// Tên thành phần
/// </summary>
public class ComponentKeyModel
{
    /// <summary>
    /// Tên thành phần
    /// </summary>
    public string Name { get; set; }
    /// <summary>
    /// Tên hiển thị của thành phần
    /// </summary>
    public string DisplayName { get; set; }
    public ComponentKeyModel(string name, string displayName)
    {
        Name = name;
        DisplayName = displayName;
    }
}
