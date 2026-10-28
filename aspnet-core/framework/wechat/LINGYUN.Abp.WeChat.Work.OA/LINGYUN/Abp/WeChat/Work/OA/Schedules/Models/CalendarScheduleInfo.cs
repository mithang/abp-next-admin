using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Chi tiết lịch trình của lịch
/// </summary>
public class CalendarScheduleInfo : ScheduleInfo
{
    /// <summary>
    /// Số hiệu lịch trình, là một số tự tăng
    /// </summary>
    [NotNull]
    [JsonProperty("sequence")]
    [JsonPropertyName("sequence")]
    public ulong Sequence { get; set; }
}
