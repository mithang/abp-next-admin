using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.Location.Baidu.Model;

public class BaiduReGeocode
{
    /// <summary>
    /// Tọa độ kinh độ/vĩ độ
    /// </summary>
    [JsonProperty("location")]
    [JsonPropertyName("location")]
    public BaiduLocation Location { get; set; } = default!;
    /// <summary>
    /// Thông tin địa chỉ có cấu trúc
    /// </summary>
    [JsonProperty("formatted_address")]
    [JsonPropertyName("formatted_address")]
    public string? FormattedAddress { get; set; }
    /// <summary>
    /// Thông tin khu thương mại nơi tọa độ nằm, ví dụ "Đại học Nhân dân, Trung Quan Thôn, phố Tô Châu".
    /// Trả về tối đa 3 kết quả.
    /// </summary>
    public string? Business { get; set; }
    /// <summary>
    /// Danh sách thành phần địa chỉ
    /// </summary>
    public AddressComponent? AddressComponent { get; set; }
    /// <summary>
    /// Mảng POI xung quanh
    /// </summary>
    public List<BaiduPoi> Pois { get; set; }
    /// <summary>
    /// Mảng đường xung quanh
    /// </summary>
    public List<BaiduRoad> Roads { get; set; }
    /// <summary>
    /// Mảng vùng xung quanh
    /// </summary>
    public List<PoiRegion> PoiRegions { get; set; }
    /// <summary>
    /// Mô tả kết quả ngữ nghĩa kết hợp vị trí hiện tại với POI
    /// </summary>
    [JsonProperty("sematic_description")]
    [JsonPropertyName("sematic_description")]
    public string? SematicDescription { get; set; }
    public BaiduReGeocode()
    {
        AddressComponent = new AddressComponent();
        Pois = new List<BaiduPoi>();
        Roads = new List<BaiduRoad>();
        PoiRegions = new List<PoiRegion>();
    }
}
