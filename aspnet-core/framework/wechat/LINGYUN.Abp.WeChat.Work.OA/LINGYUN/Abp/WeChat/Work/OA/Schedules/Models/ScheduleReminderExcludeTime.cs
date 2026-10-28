using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Ngày không bao gồm trong lịch trình lặp lại
/// </summary>
public class ScheduleReminderExcludeTime
{
    /// <summary>
    /// Dấu thời gian của ngày không bao gồm
    /// </summary>
    [NotNull]
    [JsonProperty("start_time")]
    [JsonPropertyName("start_time")]
    public long StartTime { get; set; }
}
