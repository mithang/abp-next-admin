using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết lịch trình
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/97724"/>
/// </remarks>
public class WeChatWorkGetScheduleListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("schedule_list")]
    [JsonPropertyName("schedule_list")]
    public ScheduleInfo[] ScheduleList { get; set; } = default!;
}
