using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Người tham gia lịch trình
/// </summary>
public class ScheduleAttendee
{
    /// <summary>
    /// ID người tham gia lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; }
    public ScheduleAttendee(string userId)
    {
        UserId = Check.NotNullOrWhiteSpace(userId, nameof(userId), 64); 
    }
}
