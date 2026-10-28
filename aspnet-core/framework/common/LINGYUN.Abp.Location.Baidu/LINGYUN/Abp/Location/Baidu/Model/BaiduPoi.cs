using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.Location.Baidu.Model;

public class BaiduPoi
{
    /// <summary>
    /// Thông tin địa chỉ
    /// </summary>
    [JsonProperty("addr")]
    [JsonPropertyName("addr")]
    public string Address { get; set; } = default!;
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Thẻ đánh dấu
    /// </summary>
    public string? Tag { get; set; }
    /// <summary>
    /// Hướng so với điểm tọa độ hiện tại
    /// </summary>
    public string? Direction { get; set; }
    /// <summary>
    /// Khoảng cách tới điểm tọa độ
    /// </summary>
    public string? Distance { get; set; }
    /// <summary>
    /// Tọa độ poi {x,y}
    /// </summary>
    public Point Point { get; set; } = new Point();

    /// <summary>
    /// Loại tọa độ
    /// </summary>
    public string? PoiType { get; set; }
    /// <summary>
    /// Số điện thoại
    /// </summary>
    [JsonProperty("tel")]
    [JsonPropertyName("tel")]
    public string? TelPhone { get; set; }
    /// <summary>
    /// Định danh duy nhất của poi
    /// </summary>
    public string Uid { get; set; } = default!;
    /// <summary>
    /// Mã bưu chính
    /// </summary>
    [JsonProperty("zip")]
    [JsonPropertyName("zip")]
    public string? Post { get; set; }
    /// <summary>
    /// poi chính tương ứng với poi (ví dụ: poi chính của Haidilao là Shangdi Hualian, trường này là thông tin poi của Shangdi Hualian.
    /// Nếu không có, trường này để trống), bao gồm các trường con giống với các trường truy hồi cơ bản của pois.
    /// </summary>
    [JsonProperty("parent_poi")]
    [JsonPropertyName("parent_poi")]
    public BaiduPoi? ParentPoi { get; set; }
}
