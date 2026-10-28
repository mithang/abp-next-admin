using System.Collections.Generic;

namespace LINGYUN.Abp.SystemInfo.Models;
/// <summary>
/// Thành phần
/// </summary>
public class ComponentInfoModel
{
    /// <summary>
    /// Tên thành phần
    /// </summary>
    public string Name { get; set; }
    /// <summary>
    /// Tập hợp tên thành phần
    /// </summary>
    public ComponentKeyModel[] Keys { get; set; }
    /// <summary>
    /// Tập hợp trạng thái thành phần
    /// </summary>
    public Dictionary<string, object?> Details { get; set; }
    public ComponentInfoModel(string name, ComponentKeyModel[] keys, Dictionary<string, object?> details)
    {
        Name = name;
        Keys = keys;
        Details = details;
    }
}
