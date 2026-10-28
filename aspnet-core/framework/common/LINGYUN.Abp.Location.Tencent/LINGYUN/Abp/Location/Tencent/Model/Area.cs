using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Thông tin khu vực
/// </summary>
public class Area
{
    /// <summary>
    /// Định danh duy nhất của địa điểm
    /// </summary>
    [JsonProperty("id")]
    public string Id { get; set; } = default!;
    /// <summary>
    /// Tên/Tiêu đề
    /// </summary>
    [JsonProperty("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Tọa độ
    /// </summary>
    [JsonProperty("location")]
    public Location Location { get; set; } = new Location();
    /// <summary>
    /// Khoảng cách đường thẳng từ vị trí tham chiếu này đến tọa độ đầu vào
    /// </summary>
    [JsonProperty("_distance")]
    public string? Distance { get; set; }
    /// <summary>
    /// Quan hệ phương vị từ vị trí tham chiếu này đến tọa độ đầu vào,
    /// Ví dụ: Bắc, Nam, bên trong
    /// </summary>
    [JsonProperty("_dir_desc")]
    public string? DirDescription { get; set; }
}
