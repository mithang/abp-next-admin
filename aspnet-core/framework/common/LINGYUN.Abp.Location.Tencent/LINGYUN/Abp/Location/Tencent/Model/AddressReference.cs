using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Tham chiếu vị trí tương đối của tọa độ
/// </summary>
public class AddressReference
{
    /// <summary>
    /// Khu thương mại
    /// </summary>
    [JsonProperty("business_area")]
    public Area BusinessArea { get; set; } = new Area();
    /// <summary>
    /// Khu vực nổi tiếng, ví dụ như khu thương mại hoặc khu vực mà mọi người thường cho là có độ nổi tiếng cao
    /// </summary>
    [JsonProperty("famous_area")]
    public Area FamousArea { get; set; } = new Area();
    /// <summary>
    /// Đường phố thị trấn/xã
    /// </summary>
    [JsonProperty("town")]
    public Area Town { get; set; } = new Area();
    /// <summary>
    /// Địa danh cấp một, dễ nhận biết, quy mô lớn như địa điểm, khu dân cư, v.v.
    /// </summary>
    [JsonProperty("landmark_l1")]
    public Area Landmark1 { get; set; } = new Area();
    /// <summary>
    /// Địa danh cấp hai, chính xác hơn địa danh cấp một và quy mô nhỏ hơn
    /// </summary>
    [JsonProperty("landmark_l2")]
    public Area Landmark2 { get; set; } = new Area();
    /// <summary>
    /// Đường phố
    /// </summary>
    [JsonProperty("street")]
    public Area Street { get; set; } = new Area();
    /// <summary>
    /// Số nhà
    /// </summary>
    [JsonProperty("street_number")]
    public Area StreetNumber { get; set; } = new Area();
    /// <summary>
    /// Ngã tư
    /// </summary>
    [JsonProperty("crossroad")]
    public Area CrossRoad { get; set; } = new Area();
    /// <summary>
    /// Hệ thống sông ngòi
    /// </summary>
    [JsonProperty("water")]
    public Area Water { get; set; } = new Area();
}
