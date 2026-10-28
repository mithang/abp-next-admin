using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;

public abstract class CreateOrUpdateSchedule
{
    /// <summary>
    /// Danh sách userid quản trị viên của lịch trình; quản trị viên phải nằm trong danh sách thành viên được chia sẻ
    /// </summary>
    /// <remarks>
    /// Tối đa chỉ định 3 người
    /// </remarks>
    [CanBeNull]
    [JsonProperty("admins")]
    [JsonPropertyName("admins")]
    public string[]? Admins { get; set; }
    /// <summary>
    /// Danh sách người tham gia lịch trình
    /// </summary>
    /// <remarks>
    /// Hỗ trợ tối đa 1000 người
    /// </remarks>
    [CanBeNull]
    [JsonProperty("attendees")]
    [JsonPropertyName("attendees")]
    public ScheduleAttendee[]? Attendees { get; set; }
    /// <summary>
    /// Tiêu đề lịch trình
    /// </summary>
    /// <remarks>
    /// 0 ~ 128 ký tự. Không điền sẽ hiển thị mặc định là “Sự kiện mới”
    /// </remarks>
    [CanBeNull]
    [JsonProperty("summary")]
    [JsonPropertyName("summary")]
    public string? Summary { get; set; }
    /// <summary>
    /// Mô tả lịch trình
    /// </summary>
    /// <remarks>
    /// Không quá 1000 ký tự
    /// </remarks>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Thông tin nhắc nhở liên quan
    /// </summary>
    [CanBeNull]
    [JsonProperty("reminders")]
    [JsonPropertyName("reminders")]
    public ScheduleReminder? Reminders { get; set; }
    /// <summary>
    /// Địa chỉ lịch trình
    /// </summary>
    /// <remarks>
    /// Không quá 128 ký tự
    /// </remarks>
    [CanBeNull]
    [JsonProperty("location")]
    [JsonPropertyName("location")]
    public string? Location { get; set; }
    /// <summary>
    /// Thời gian bắt đầu lịch trình, timestamp Unix
    /// </summary>
    [NotNull]
    [JsonProperty("start_time")]
    [JsonPropertyName("start_time")]
    public long StartTime { get; }
    /// <summary>
    /// Thời gian kết thúc lịch trình, timestamp Unix
    /// </summary>
    [NotNull]
    [JsonProperty("end_time")]
    [JsonPropertyName("end_time")]
    public long EndTime { get; }
    /// <summary>
    /// ID lịch mà lịch trình thuộc về
    /// </summary>
    /// <remarks>
    /// Không quá 64 byte
    /// </remarks>
    [CanBeNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string? CalId { get; set; }
    /// <summary>
    /// Có phải lịch trình cả ngày hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_whole_day")]
    [JsonPropertyName("is_whole_day")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool? IsWholeDay { get; set; }
    protected CreateOrUpdateSchedule(DateTime startTime, DateTime endTime)
    {
        StartTime = startTime.GetUnixTimeSeconds();
        EndTime = endTime.GetUnixTimeSeconds();
    }

    /// <summary>
    /// Kiểm tra dữ liệu đầu vào
    /// </summary>
    /// <exception cref="ArgumentException"></exception>
    public void Validate()
    {
        Check.Length(Summary, nameof(Summary), 128);
        Check.Length(Description, nameof(Description), 1000);
        Check.Length(Location, nameof(Location), 128);
        Check.Length(CalId, nameof(CalId), 64);

        if (Admins?.Length > 3)
        {
            throw new ArgumentException("Admins list. Up to 3!", nameof(Admins));
        }

        if (Attendees?.Length > 1000)
        {
            throw new ArgumentException("Attendees list. Up to 1000!", nameof(Attendees));
        }
    }
}
