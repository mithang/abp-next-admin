using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Kết quả định vị IP
/// </summary>
public class TencentIPGeocode
{
    /// <summary>
    /// Địa chỉ IP dùng để định vị
    /// </summary>
    [JsonProperty("ip")]
    public string IpAddress { get; set; } = default!;
    /// <summary>
    /// Tọa độ định vị
    /// </summary>
    [JsonProperty("location")]
    public Location Location { get; set; } = new Location();
    /// <summary>
    /// Thông tin đơn vị hành chính định vị
    /// </summary>
    [JsonProperty("ad_info")]
    public AddressInfo AddressInfo { get; set; } = new AddressInfo();
}
