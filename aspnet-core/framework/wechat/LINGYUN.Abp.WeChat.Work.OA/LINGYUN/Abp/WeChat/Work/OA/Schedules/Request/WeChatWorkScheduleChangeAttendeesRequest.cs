using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Request;

public abstract class WeChatWorkScheduleChangeAttendeesRequest : WeChatWorkRequest
{
    private List<ScheduleAttendee> _attendees = new List<ScheduleAttendee>();
    /// <summary>
    /// ID lịch trình.
    /// </summary>
    /// <remarks>
    /// ID được trả về khi tạo lịch trình
    /// </remarks>
    [NotNull]
    [JsonProperty("schedule_id")]
    [JsonPropertyName("schedule_id")]
    public string ScheduleId { get; }
    /// <summary>
    /// Danh sách người tham gia lịch trình
    /// </summary>
    /// <remarks>
    /// Tổng cộng hỗ trợ tối đa 1000 người
    /// </remarks>
    [CanBeNull]
    [JsonProperty("attendees")]
    [JsonPropertyName("attendees")]
    public ScheduleAttendee[]? Attendees {
        get {
            if (_attendees.Count > 0)
            {
                return _attendees.ToArray();
            }
            return null;
        }
    }
    protected WeChatWorkScheduleChangeAttendeesRequest(string scheduleId)
    {
        ScheduleId = Check.NotNullOrWhiteSpace(scheduleId, nameof(scheduleId));
    }

    /// <summary>
    /// Thêm một người tham gia lịch trình
    /// </summary>
    /// <param name="userId"></param>
    public void AddAttendee(string userId)
    {
        _attendees.Add(new ScheduleAttendee(userId));
    }
    /// <summary>
    /// Xóa một người tham gia lịch trình
    /// </summary>
    /// <param name="userId"></param>
    public void RemoveAttendee(string userId)
    {
        _attendees.RemoveAll(x => x.UserId == userId);
    }
    /// <summary>
    /// Xóa toàn bộ người tham gia lịch trình
    /// </summary>
    public void ClearAttendee()
    {
        _attendees.Clear();
    }
}
