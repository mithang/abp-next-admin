using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
/// <summary>
/// Tọa độ phòng họp
/// </summary>
public class MeetingRoomCoordinate
{
    /// <summary>
    /// Vĩ độ của tòa nhà nơi đặt phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("latitude")]
    [JsonPropertyName("latitude")]
    public string Latitude { get; }
    /// <summary>
    /// Kinh độ của tòa nhà nơi đặt phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("longitude")]
    [JsonPropertyName("longitude")]
    public string Longitude { get; }
    public MeetingRoomCoordinate(decimal latitude, decimal longitude)
    {
        Latitude = latitude.ToString(); 
        Longitude = longitude.ToString();
    }
}
