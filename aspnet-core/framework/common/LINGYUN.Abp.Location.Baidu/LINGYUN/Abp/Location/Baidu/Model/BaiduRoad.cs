namespace LINGYUN.Abp.Location.Baidu.Model;

/// <summary>
/// Đường đi
/// </summary>
public class BaiduRoad 
{
    public string Name { get; set; } = default!;
    /// <summary>
    /// Khoảng cách ước chừng từ điểm tọa độ truyền vào đến đường đi
    /// </summary>
    public string? Distance { get; set; }
}
