using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;
/// <summary>
/// Tham số yêu cầu cập nhật lịch trình
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/97720"/>
/// </remarks>
public class WeChatWorkUpdateScheduleRequest : WeChatWorkRequest
{
    /// <summary>
    /// Thông tin lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("schedule")]
    [JsonPropertyName("schedule")]
    public UpdateSchedule Schedule { get; }
    /// <summary>
    /// Có bỏ qua việc cập nhật người tham gia hay không
    /// </summary>
    [CanBeNull]
    [JsonProperty("skip_attendees")]
    [JsonPropertyName("skip_attendees")]
    public uint? SkipAttendees { get; }
    /// <summary>
    /// Chế độ thao tác.
    /// </summary>
    /// <remarks>
    /// Có hiệu lực khi là lịch trình lặp lại.
    /// </remarks>
    [CanBeNull]
    [JsonProperty("op_mode")]
    [JsonPropertyName("op_mode")]
    public ScheduleUpdateMode? OpMode { get; private set; }
    /// <summary>
    /// Thời gian bắt đầu thao tác.
    /// </summary>
    /// <remarks>
    /// Chỉ có hiệu lực khi chế độ thao tác là OnlyModifyThisSchedule hoặc ModifyAllFutureSchedules.
    /// Thời gian này phải là một thời gian bắt đầu nào đó của lịch trình lặp lại.
    /// Ví dụ:
    /// Giả sử thời gian bắt đầu lịch trình start_time là 1661990950 (2022-09-01 08:09:10), và loại lặp lại là hàng tuần, thì op_start_time có thể là: 1661990950 (2022-09-01 08:09:10), 1662595750 (2022-09-08 08:09:10), 1663200550 (2022-09-15 08:09:10)...
    /// </remarks>
    [CanBeNull]
    [JsonProperty("op_start_time")]
    [JsonPropertyName("op_start_time")]
    public long? OpStartTime { get; private set; }
    public WeChatWorkUpdateScheduleRequest(UpdateSchedule schedule, bool skipAttendees = false)
    {
        Schedule = schedule;
        SkipAttendees = skipAttendees ? 1u : 0u;
    }
    /// <summary>
    /// Sửa thời gian bắt đầu của lịch trình này
    /// </summary>
    /// <param name="startTime"></param>
    public void ModifyThisSchedule(DateTime startTime)
    {
        OpMode = ScheduleUpdateMode.ModifyThisSchedule;
        OpStartTime = startTime.GetUnixTimeSeconds();
    }
    /// <summary>
    /// Sửa thời gian bắt đầu của tất cả lịch trình
    /// </summary>
    /// <param name="startTime"></param>
    public void ModifyAllFutureSchedules(DateTime startTime)
    {
        OpMode = ScheduleUpdateMode.ModifyAllFutureSchedules;
        OpStartTime = startTime.GetUnixTimeSeconds();
    }

    protected override void Validate()
    {
        Check.NotNull(Schedule, nameof(Schedule));

        Schedule.Validate();
    }
}
