using System.Collections.Generic;

namespace LINGYUN.Abp.Location;

public class IPGecodeLocation
{
    /// <summary>
    /// Địa chỉ IP
    /// </summary>
    public string IpAddress { get; set; } = default!;
    /// <summary>
    /// Tọa độ định vị
    /// </summary>
    public Location Location { get; set; } = new Location();
    /// <summary>
    /// Quốc gia
    /// </summary>
    public string? Country { get; set; }
    /// <summary>
    /// Thành phố
    /// </summary>
    public string? City { get; set; }
    /// <summary>
    /// Tỉnh
    /// </summary>
    public string? Province { get; set; }
    /// <summary>
    /// Quận/huyện
    /// </summary>
    public string? District { get; set; }
    /// <summary>
    /// adcode
    /// </summary>
    public string? AdCode { get; set; }

    public IDictionary<string, object> Additionals { get; } = new Dictionary<string, object>();

    public void AddAdditional(string key, object value)
    {
        Additionals.Add(key, value);
    }
}
