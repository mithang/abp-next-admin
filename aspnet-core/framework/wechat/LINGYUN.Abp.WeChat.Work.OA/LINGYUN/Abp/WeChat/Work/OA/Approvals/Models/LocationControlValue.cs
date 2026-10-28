using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển vị trí
/// </summary>
public class LocationControlValue : ControlValue
{
    /// <summary>
    /// Vị trí
    /// </summary>
    [NotNull]
    [JsonProperty("location")]
    [JsonPropertyName("location")]
    public LocationValue Location { get; set; } = default!;
    public LocationControlValue()
    {

    }

    public LocationControlValue(LocationValue location)
    {
        Location = location;
    }
}

public class LocationValue
{
    /// <summary>
    /// Vĩ độ, chính xác đến 6 chữ số thập phân
    /// </summary>
    [NotNull]
    [JsonProperty("latitude")]
    [JsonPropertyName("latitude")]
    public decimal Latitude { get; set; }
    /// <summary>
    /// Kinh độ, chính xác đến 6 chữ số thập phân
    /// </summary>
    [NotNull]
    [JsonProperty("longitude")]
    [JsonPropertyName("longitude")]
    public decimal Longitude { get; set; }
    /// <summary>
    /// Tiêu đề địa điểm
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// Địa chỉ chi tiết địa điểm
    /// </summary>
    [NotNull]
    [JsonProperty("address")]
    [JsonPropertyName("address")]
    public string Address { get; set; } = default!;
    /// <summary>
    /// Thời gian chọn địa điểm
    /// </summary>
    [NotNull]
    [JsonProperty("time")]
    [JsonPropertyName("time")]
    public long Time { get; set; }
    public LocationValue()
    {

    }

    public LocationValue(decimal latitude, decimal longitude, string title, string address, long time)
    {
        Latitude = latitude;
        Longitude = longitude;
        Title = title;
        Address = address;
        Time = time;
    }
}