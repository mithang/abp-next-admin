using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Request;
/// <summary>
/// Tham số yêu cầu truy vấn phòng họp
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/93619#%E6%9F%A5%E8%AF%A2%E4%BC%9A%E8%AE%AE%E5%AE%A4"/>
/// </remarks>
public class WeChatWorkGetMeetingRoomListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Thành phố nơi phòng họp tọa lạc
    /// </summary>
    [CanBeNull]
    [JsonProperty("city")]
    [JsonPropertyName("city")]
    public string? City { get; set; }
    /// <summary>
    /// Tòa nhà nơi phòng họp tọa lạc
    /// </summary>
    [CanBeNull]
    [JsonProperty("building")]
    [JsonPropertyName("building")]
    public string? Building { get; set; }
    /// <summary>
    /// Tầng nơi phòng họp tọa lạc
    /// </summary>
    [CanBeNull]
    [JsonProperty("floor")]
    [JsonPropertyName("floor")]
    public string? Floor { get; set; }
    /// <summary>
    /// Danh sách thiết bị phòng họp hỗ trợ
    /// </summary>
    private readonly List<int> _equipment;
    /// <summary>
    /// Danh sách thiết bị phòng họp hỗ trợ
    /// </summary>
    [CanBeNull]
    [JsonProperty("equipment")]
    [JsonPropertyName("equipment")]
    public int[] Equipment => _equipment.ToArray();
    public WeChatWorkGetMeetingRoomListRequest()
    {
        _equipment = new List<int>();
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
