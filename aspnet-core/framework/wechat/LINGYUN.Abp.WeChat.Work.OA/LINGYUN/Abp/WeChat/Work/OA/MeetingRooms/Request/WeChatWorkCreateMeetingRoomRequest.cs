using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Linq;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Request;
/// <summary>
/// Tham số yêu cầu thêm phòng họp
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/93619#%E6%B7%BB%E5%8A%A0%E4%BC%9A%E8%AE%AE%E5%AE%A4"/>
/// </remarks>
public class WeChatWorkCreateMeetingRoomRequest : WeChatWorkRequest
{
    /// <summary>
    /// Tên phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; }
    /// <summary>
    /// Sức chứa của phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("capacity")]
    [JsonPropertyName("capacity")]
    public int Capacity { get; }
    /// <summary>
    /// Thành phố nơi đặt phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("city")]
    [JsonPropertyName("city")]
    public string? City { get; private set; }
    /// <summary>
    /// Tòa nhà nơi đặt phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("building")]
    [JsonPropertyName("building")]
    public string? Building { get; private set; }
    /// <summary>
    /// Tầng nơi đặt phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("floor")]
    [JsonPropertyName("floor")]
    public string? Floor { get; private set; }
    /// <summary>
    /// Danh sách thiết bị phòng họp hỗ trợ
    /// </summary>
    private readonly List<int> _equipment;
    /// <summary>
    /// Danh sách thiết bị phòng họp hỗ trợ
    /// </summary>
    [NotNull]
    [JsonProperty("equipment")]
    [JsonPropertyName("equipment")]
    public int[] Equipment => _equipment.ToArray();
    /// <summary>
    /// Tọa độ phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("coordinate")]
    [JsonPropertyName("coordinate")]
    public MeetingRoomCoordinate? Coordinate { get; set; }
    /// <summary>
    /// Phạm vi sử dụng phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("range")]
    [JsonPropertyName("range")]
    public MeetingRoomRange? Range { get; set; }
    public WeChatWorkCreateMeetingRoomRequest(string name, int capacity)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), 30);
        Capacity = Check.NotDefaultOrNull<int>(capacity, nameof(capacity));

        _equipment = new List<int>();
    }
    /// <summary>
    /// Thiết lập thông tin vị trí
    /// </summary>
    /// <param name="city"></param>
    /// <param name="building"></param>
    /// <param name="floor"></param>
    public void WithLocation(string city, string building, string floor)
    {
        City = Check.NotNullOrWhiteSpace(city, nameof(city));
        Building = Check.NotNullOrWhiteSpace(building, nameof(building));
        Floor = Check.NotNullOrWhiteSpace(floor, nameof(floor));
    }
    /// <summary>
    /// Cho phép thiết bị TV
    /// </summary>
    /// <returns></returns>
    public void WithTv()
    {
        _equipment.AddIfNotContains(1);
    }
    /// <summary>
    /// Cho phép thiết bị điện thoại
    /// </summary>
    /// <returns></returns>
    public void WithPhone()
    {
        _equipment.AddIfNotContains(2);

    }
    /// <summary>
    /// Cho phép thiết bị máy chiếu
    /// </summary>
    /// <returns></returns>
    public void WithProjection()
    {
        _equipment.AddIfNotContains(3);
    }
    /// <summary>
    /// Cho phép thiết bị bảng trắng
    /// </summary>
    /// <returns></returns>
    public void WithWhiteboard()
    {
        _equipment.AddIfNotContains(4);
    }
    /// <summary>
    /// Cho phép thiết bị video
    /// </summary>
    /// <returns></returns>
    public void WithVideo()
    {
        _equipment.AddIfNotContains(5);
    }
}
