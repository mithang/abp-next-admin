using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

public class TencentGeocode
{
    /// <summary>
    /// Tọa độ đã phân giải
    /// </summary>
    [JsonProperty("location")]
    public Location Location { get; set; } = new Location();
    /// <summary>
    /// Thành phần địa chỉ sau khi phân giải
    /// </summary>
    [JsonProperty("address_components")]
    public AddressComponent AddressComponent { get; set; } = new AddressComponent();
    /// <summary>
    /// Thông tin phân chia hành chính
    /// </summary>
    [JsonProperty("ad_info")]
    public GeocodeAddressInfo AddressInfo { get; set; } = new GeocodeAddressInfo();
    /// <summary>
    /// Tham khảo độ tin cậy: phạm vi giá trị 1 <độ tin cậy thấp> - 10 <độ tin cậy cao>
    /// </summary>
    [JsonProperty("reliability")]
    public int Reliability { get; set; }
    /// <summary>
    /// Mức độ chính xác phân giải, chia thành 11 cấp độ, thông thường >=9 là có thể áp dụng (định vị đến điểm, độ chính xác cao), cũng có thể tự điều chỉnh theo nhu cầu nghiệp vụ thực tế
    /// </summary>
    [JsonProperty("level")]
    public int Level { get; set; }
}
/// <summary>
/// Thông tin phân chia hành chính
/// </summary>
public class GeocodeAddressInfo
{
    /// <summary>
    /// Mã phân chia hành chính
    /// </summary>
    [JsonProperty("adcode")]
    public string AdCode { get; set; } = default!;
}
