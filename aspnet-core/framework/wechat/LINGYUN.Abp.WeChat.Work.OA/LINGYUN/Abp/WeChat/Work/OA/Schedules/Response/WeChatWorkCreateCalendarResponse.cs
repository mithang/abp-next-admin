using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Response;
/// <summary>
/// Tham số phản hồi tạo lịch
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/93647"/>
/// </remarks>
public class WeChatWorkCreateCalendarResponse : WeChatWorkResponse
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [NotNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string CalId { get; set; } = default!;
    /// <summary>
    /// Nội dung nhập vào không hợp lệ
    /// </summary>
    [NotNull]
    [JsonProperty("fail_result")]
    [JsonPropertyName("fail_result")]
    public CalendarFailResult FailResult { get; set; } = default!;
}
