using System.Collections.Generic;

namespace LINGYUN.Abp.Location;

/// <summary>
/// Địa chỉ ngược
/// </summary>
public class ReGeocodeLocation
{
    /// <summary>
    /// Địa chỉ chi tiết
    /// </summary>
    public string? Address { get; set; }
    /// <summary>
    /// Mô tả địa chỉ đã định dạng
    /// </summary>
    public string? FormattedAddress { get; set; }
    /// <summary>
    /// Quốc gia
    /// </summary>
    public string? Country { get; set; }
    /// <summary>
    /// Tỉnh
    /// </summary>
    public string? Province { get; set; }
    /// <summary>
    /// Thành phố
    /// </summary>
    public string? City { get; set; }
    /// <summary>
    /// Quận/huyện
    /// </summary>
    public string? District { get; set; }
    /// <summary>
    /// Đường phố
    /// </summary>
    public string? Street { get; set; }
    /// <summary>
    /// adcode
    /// </summary>
    public string? AdCode { get; set; }
    /// <summary>
    /// Thị trấn/xã
    /// </summary>
    public string? Town { get; set; }
    /// <summary>
    /// Số nhà
    /// </summary>
    public string? Number { get; set; }
    /// <summary>
    /// Danh sách thông tin POI
    /// </summary>
    public IEnumerable<Poi> Pois { get; set; }
    /// <summary>
    /// Danh sách thông tin đường
    /// </summary>
    public IEnumerable<Road> Roads { get; set; }
    /// <summary>
    /// Thông tin bổ sung
    /// </summary>
    public IDictionary<string, object> Additionals { get; }

    public ReGeocodeLocation()
    {
        Pois = new Poi[0];
        Roads = new Road[0];
        Additionals = new Dictionary<string, object>();
    }

    public void AddAdditional(string key, object value)
    {
        Additionals.Add(key, value);
    }
}
