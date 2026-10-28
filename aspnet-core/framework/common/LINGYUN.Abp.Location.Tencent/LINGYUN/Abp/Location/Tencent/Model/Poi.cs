using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Đối tượng POI
/// </summary>
public class Poi
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
    public string Title { get; set; } = default!;
    /// <summary>
    /// Địa chỉ
    /// </summary>
    [JsonProperty("address")]
    public string Address { get; set; } = default!;
    /// <summary>
    /// Phân loại POI
    /// </summary>
    [JsonProperty("category")]
    public string CateGory { get; set; } = default!;
    /// <summary>
    /// Tọa độ
    /// </summary>
    [JsonProperty("location")]
    public Location Location { get; set; } = new Location();
    /// <summary>
    /// Khoảng cách đường thẳng từ POI này đến tọa độ được truyền vào khi phân giải địa chỉ ngược
    /// </summary>
    [JsonProperty("_distance")]
    public double Distance { get; set; }
    /// <summary>
    /// Thông tin phân chia hành chính
    /// </summary>
    [JsonProperty("ad_info")]
    public AddressInfo AddressInfo { get; set; } = new AddressInfo();
}
