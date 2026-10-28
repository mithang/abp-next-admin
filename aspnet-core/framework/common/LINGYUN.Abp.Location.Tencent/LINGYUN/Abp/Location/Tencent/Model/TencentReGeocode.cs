using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Kết quả phân giải địa chỉ ngược
/// </summary>
public class TencentReGeocode
{
    /// <summary>
    /// Mô tả địa chỉ
    /// </summary>
    [JsonProperty("address")]
    public string? Address { get; set; }
    /// <summary>
    /// Mô tả vị trí
    /// </summary>
    [JsonProperty("formatted_addresses")]
    public FormattedAddress FormattedAddress { get; set; } = new FormattedAddress();
    /// <summary>
    /// Các thành phần địa chỉ; khi address không đáp ứng nhu cầu có thể tự ghép lại
    /// </summary>
    [JsonProperty("address_component")]
    public AddressComponent AddressComponent { get; set; } = new AddressComponent();
    /// <summary>
    /// Thông tin phân chia hành chính
    /// </summary>
    [JsonProperty("ad_info")]
    public AddressInfo AddressInfo { get; set; } = new AddressInfo();
    /// <summary>
    /// Tham chiếu vị trí tương đối của tọa độ
    /// </summary>
    [JsonProperty("address_reference")]
    public AddressReference AddressReference { get; set; } = new AddressReference();
    /// <summary>
    /// Tổng số POI xung quanh được truy vấn
    /// </summary>
    [JsonProperty("poi_count")]
    public int PoiCount { get; set; }
    /// <summary>
    /// Mảng POI, mỗi mục con trong đối tượng là một đối tượng POI
    /// </summary>
    [JsonProperty("pois")]
    public Poi[] Pois { get; set; } = new Poi[0];
}
