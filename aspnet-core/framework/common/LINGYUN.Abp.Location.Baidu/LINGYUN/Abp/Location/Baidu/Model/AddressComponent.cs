using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.Location.Baidu.Model;

public class AddressComponent
{
    /// <summary>
    /// Quốc gia
    /// </summary>
    public string? Country { get; set; }
    /// <summary>
    /// Mã quốc gia
    /// </summary>
    [JsonProperty("country_code")]
    [JsonPropertyName("country_code")]
    public int CountryCode { get; set; }
    /// <summary>
    /// Tên viết tắt tiếng Anh của quốc gia (ba ký tự)
    /// </summary>
    [JsonProperty("country_code_iso")]
    [JsonPropertyName("country_code_iso")]
    public string? CountryCodeIso { get; set; }
    /// <summary>
    /// Tên viết tắt tiếng Anh của quốc gia (hai ký tự)
    /// </summary>
    [JsonProperty("country_code_iso2")]
    [JsonPropertyName("country_code_iso2")]
    public string? CountryCodeIso2 { get; set; }
    /// <summary>
    /// Tên tỉnh
    /// </summary>
    public string? Province { get; set; }
    /// <summary>
    /// Tên thành phố
    /// </summary>
    public string? City { get; set; }
    /// <summary>
    /// Cấp của thành phố (chỉ có ý nghĩa tham khảo đối với nước ngoài.
    /// Đơn vị hành chính ở nước ngoài khác với Trung Quốc, cấp tương ứng với thành phố không nhất thiết là “city”.
    /// country, province, city, district, town tương ứng lần lượt với các cấp 0-4; nếu city_level=3 thì cấp district là cấp city của quốc gia đó)
    /// </summary>
    [JsonProperty("city_level")]
    [JsonPropertyName("city_level")]
    public int CityLevel { get; set; }
    /// <summary>
    /// Tên quận/huyện
    /// </summary>
    public string? District { get; set; }
    /// <summary>
    /// Tên xã/thị trấn
    /// </summary>
    public string? Town { get; set; }
    /// <summary>
    /// Id xã/thị trấn
    /// </summary>
    [JsonProperty("town_code")]
    [JsonPropertyName("town_code")]
    public string? TownCode { get; set; }
    /// <summary>
    /// Tên đường (cấp đường phố trong đơn vị hành chính)
    /// </summary>
    public string? Street { get; set; }
    /// <summary>
    /// Số nhà trên đường
    /// </summary>
    [JsonProperty("street_number")]
    [JsonPropertyName("street_number")]
    public string? StreetNumber { get; set; }
    /// <summary>
    /// Mã đơn vị hành chính
    /// </summary>
    public string? AdCode { get; set; }
    /// <summary>
    /// Hướng tương đối so với điểm tọa độ hiện tại, dữ liệu được trả về khi có số nhà
    /// </summary>
    public string? Direction { get; set; }
    /// <summary>
    /// Khoảng cách tương đối so với điểm tọa độ hiện tại, dữ liệu được trả về khi có số nhà
    /// </summary>
    public string? Distance { get; set; }
}
