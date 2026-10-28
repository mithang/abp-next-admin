using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Thành phần địa chỉ, khi address không đáp ứng nhu cầu có thể tự ghép nối
/// </summary>
public class AddressComponent
{
    /// <summary>
    /// Quốc gia
    /// </summary>
    [JsonProperty("nation")]
    public string? Nation { get; set; }
    /// <summary>
    /// Tỉnh
    /// </summary>
    [JsonProperty("province")]
    public string? Province { get; set; }
    /// <summary>
    /// Thành phố
    /// </summary>
    [JsonProperty("city")]
    public string? City { get; set; }
    /// <summary>
    /// Quận/huyện, có thể là chuỗi rỗng
    /// </summary>
    [JsonProperty("district")]
    public string? District { get; set; }
    /// <summary>
    /// Đường phố, có thể là chuỗi rỗng
    /// </summary>
    [JsonProperty("street")]
    public string? Street { get; set; }
    /// <summary>
    /// Số nhà, có thể là chuỗi rỗng
    /// </summary>
    [JsonProperty("street_number")]
    public string? StreetNumber { get; set; }
}
