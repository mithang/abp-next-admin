using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết lịch
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/97717"/>
/// </remarks>
public class WeChatWorkGetCalendarListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách lịch
    /// </summary>
    [NotNull]
    [JsonProperty("calendar_list")]
    [JsonPropertyName("calendar_list")]
    public CalendarInfo[] CalendarList { get; set; } = default!;
}
