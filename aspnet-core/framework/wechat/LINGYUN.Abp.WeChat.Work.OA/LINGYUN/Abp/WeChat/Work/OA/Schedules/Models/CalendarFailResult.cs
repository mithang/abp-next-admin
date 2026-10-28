using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Nội dung nhập không hợp lệ
/// </summary>
public class CalendarFailResult
{
    /// <summary>
    /// Danh sách thành viên trong phạm vi thông báo lịch không hợp lệ
    /// </summary>
    [CanBeNull]
    [JsonProperty("shares")]
    [JsonPropertyName("shares")]
    public CalendarFailShare[] Shares { get; set; } = default!;
}
