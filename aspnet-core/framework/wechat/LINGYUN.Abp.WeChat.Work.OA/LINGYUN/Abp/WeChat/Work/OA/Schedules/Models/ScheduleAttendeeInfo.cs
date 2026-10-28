using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Chi tiết người tham gia lịch trình
/// </summary>
public class ScheduleAttendeeInfo
{
    /// <summary>
    /// Id người tham gia lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Trạng thái chấp nhận của người tham gia lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("response_status")]
    [JsonPropertyName("response_status")]
    public ScheduleAttendeeResponseStatus ResponseStatus { get; set; }
}
