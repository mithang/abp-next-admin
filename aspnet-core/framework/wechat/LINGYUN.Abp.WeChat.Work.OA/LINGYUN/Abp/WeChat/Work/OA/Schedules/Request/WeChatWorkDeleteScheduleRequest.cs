using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu hủy lịch trình
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/97725"/>
/// </remarks>
public class WeChatWorkDeleteScheduleRequest : WeChatWorkRequest
{
    /// <summary>
    /// ID lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("schedule_id")]
    [JsonPropertyName("schedule_id")]
    public string ScheduleId { get; }
    /// <summary>
    /// Chế độ thao tác.
    /// </summary>
    /// <remarks>
    /// Có hiệu lực khi là lịch trình lặp lại.
    /// </remarks>
    [CanBeNull]
    [JsonProperty("op_mode")]
    [JsonPropertyName("op_mode")]
    public ScheduleDeleteMode? OpMode { get; private set; }
    /// <summary>
    /// Thời gian bắt đầu thao tác.
    /// </summary>
    /// <remarks>
    /// Chỉ có hiệu lực khi chế độ thao tác là DeleteThisSchedule hoặc DeleteAllFutureSchedules.
    /// Thời gian này phải là thời gian bắt đầu của một lần nào đó trong lịch trình lặp lại.
    /// </remarks>
    [CanBeNull]
    [JsonProperty("op_start_time")]
    [JsonPropertyName("op_start_time")]
    public long? OpStartTime { get; private set; }
    public WeChatWorkDeleteScheduleRequest(string scheduleId)
    {
        ScheduleId = Check.NotNullOrWhiteSpace(scheduleId, nameof(scheduleId));
    }
    /// <summary>
    /// Xóa thời gian bắt đầu của lịch trình này
    /// </summary>
    /// <param name="startTime"></param>
    public void DeleteThisSchedule(DateTime startTime)
    {
        OpMode = ScheduleDeleteMode.DeleteThisSchedule;
        OpStartTime = startTime.GetUnixTimeSeconds();
    }
    /// <summary>
    /// Xóa thời gian bắt đầu của tất cả lịch trình
    /// </summary>
    /// <param name="startTime"></param>
    public void DeleteAllFutureSchedules(DateTime startTime)
    {
        OpMode = ScheduleDeleteMode.DeleteAllFutureSchedules;
        OpStartTime = startTime.GetUnixTimeSeconds();
    }
}
