using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Thông tin phân vùng hành chính
/// </summary>
public class AddressInfo
{
    [JsonProperty("adcode")]
    public string AdCode { get; set; } = default!;
    /// <summary>
    /// Mã thành phố
    /// </summary>
    [JsonProperty("city_code")]
    public string? CityCode { get; set; }
    /// <summary>
    /// Mã phân vùng hành chính
    /// </summary>
    [JsonProperty("nation_code")]
    public string? NationCode { get; set; }
    /// <summary>
    /// Tên phân vùng hành chính
    /// </summary>
    [JsonProperty("name")]
    public string? Name { get; set; }
    /// <summary>
    /// Quốc gia
    /// </summary>
    [JsonProperty("nation")]
    public string? Nation { get; set; }
    /// <summary>
    /// Tỉnh/Thành phố trực thuộc trung ương
    /// </summary>
    [JsonProperty("province")]
    public string? Province { get; set; }
    /// <summary>
    /// Thành phố/Khu vực cấp địa và phân vùng hành chính cùng cấp
    /// </summary>
    [JsonProperty("city")]
    public string? City { get; set; }
    /// <summary>
    /// Quận/Thành phố cấp huyện và phân vùng hành chính cùng cấp
    /// </summary>
    [JsonProperty("district")]
    public string? District { get; set; }
    /// <summary>
    /// Toạ độ điểm trung tâm của phân vùng hành chính
    /// </summary>
    [JsonProperty("location")]
    public Location Location { get; set; } = new Location();
}
