using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Thành viên thuộc phạm vi thông báo lịch
/// </summary>
public class CalendarShare
{
    /// <summary>
    /// id của thành viên thuộc phạm vi thông báo lịch
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Quyền của thành viên thuộc phạm vi thông báo lịch
    /// </summary>
    [NotNull]
    [JsonProperty("permission")]
    [JsonPropertyName("permission")]
    public CalendarSharePermission Permission { get; set; }
}
