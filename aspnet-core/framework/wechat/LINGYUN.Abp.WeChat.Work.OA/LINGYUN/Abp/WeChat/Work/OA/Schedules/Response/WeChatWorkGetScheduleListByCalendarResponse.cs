using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách lịch trình thuộc lịch
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/97723"/>
/// </remarks>
public class WeChatWorkGetScheduleListByCalendarResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("schedule_list")]
    [JsonPropertyName("schedule_list")]
    public CalendarScheduleInfo[] ScheduleList { get; set; } = default!;
}
