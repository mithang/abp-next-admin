using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Nhắc nhở lịch trình
/// </summary>
public class ScheduleReminder
{
    /// <summary>
    /// Có cần nhắc nhở hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_remind")]
    [JsonPropertyName("is_remind")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsRemind { get; set; }
    /// <summary>
    /// Có phải lịch trình lặp lại hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_repeat")]
    [JsonPropertyName("is_repeat")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsRepeat { get; set; }
    /// <summary>
    /// Nhắc trước khi lịch trình bắt đầu (start_time) bao nhiêu giây, có hiệu lực khi is_remind bằng 1. Ví dụ: 300 nghĩa là nhắc trước khi lịch trình bắt đầu 5 phút. Hiện tại chỉ hỗ trợ các giá trị sau:
    /// <list type="number">
    ///     <item>0 - Khi sự kiện bắt đầu</item>
    ///     <item>300 - Trước khi sự kiện bắt đầu 5 phút</item>
    ///     <item>900 - Trước khi sự kiện bắt đầu 15 phút</item>
    ///     <item>3600 - Trước khi sự kiện bắt đầu 1 giờ</item>
    ///     <item>86400 - Trước khi sự kiện bắt đầu 1 ngày</item>
    /// </list>
    /// </summary>
    /// <remarks>
    /// Lưu ý: Nên dùng trường remind_time_diffs, trường này sau đó sẽ bị loại bỏ.
    /// </remarks>
    [CanBeNull]
    [JsonProperty("remind_before_event_secs")]
    [JsonPropertyName("remind_before_event_secs")]
    public uint? RemindBeforeEventSecs { get; set; }
    /// <summary>
    /// Hiệu số giữa thời gian nhắc và thời gian bắt đầu lịch trình (start_time), có hiệu lực khi IsRemind bằng true. Ví dụ: -300 nghĩa là nhắc trước khi lịch trình bắt đầu 5 phút.
    /// </summary>
    /// <remarks>
    /// Trường hợp đặc biệt: Lịch trình loại “cả ngày” được cài đặt trên đầu cuối WeChat Doanh nghiệp, do start_time là dấu thời gian lúc 0 giờ, nếu nhắc được đặt lúc 9 giờ cùng ngày thì sẽ xuất hiện số dương 32400.
    /// Phạm vi giá trị: -604800 ~ 86399
    /// </remarks>
    [CanBeNull]
    [JsonProperty("remind_time_diffs")]
    [JsonPropertyName("remind_time_diffs")]
    public int[]? RemindTimeDiffs { get; set; }
    /// <summary>
    /// Loại lặp lại, có hiệu lực khi IsRepeat bằng true
    /// </summary>
    [CanBeNull]
    [JsonProperty("repeat_type")]
    [JsonPropertyName("repeat_type")]
    public ScheduleReminderRepeatType? RepeatType { get; set; }
    /// <summary>
    /// Thời điểm kết thúc lặp lại, dấu thời gian Unix. Không điền hoặc điền 0 nghĩa là lặp mãi
    /// </summary>
    [CanBeNull]
    [JsonProperty("repeat_until")]
    [JsonPropertyName("repeat_until")]
    public long? RepeatUntil { get; set; }
    /// <summary>
    /// Có phải lặp tùy chỉnh hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_custom_repeat")]
    [JsonPropertyName("is_custom_repeat")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsCustomRepeat { get; set; }
    /// <summary>
    /// Khoảng lặp lại
    /// </summary>
    /// <remarks>
    /// Chỉ có hiệu lực khi chỉ định lặp tùy chỉnh.
    /// Ý nghĩa của trường này khác nhau tùy theo repeat_type.
    /// Ví dụ:
    /// repeat_interval chỉ định là 2, repeat_type chỉ định lặp hàng tuần, thì lặp lại mỗi 2 tuần một lần;
    /// repeat_interval chỉ định là 2, repeat_type chỉ định lặp hàng tháng, thì lặp lại mỗi 2 tháng một lần
    /// </remarks>
    [CanBeNull]
    [JsonProperty("repeat_interval")]
    [JsonPropertyName("repeat_interval")]
    public uint? RepeatInterval { get; set; }
    /// <summary>
    /// Lặp lại vào thứ mấy trong tuần
    /// </summary>
    /// <remarks>
    /// Chỉ có hiệu lực khi chỉ định lặp tùy chỉnh và loại lặp là hàng tuần.
    /// Phạm vi giá trị: 1 ~ 7, lần lượt biểu thị thứ Hai đến Chủ Nhật
    /// </remarks>
    [CanBeNull]
    [JsonProperty("repeat_day_of_week")]
    [JsonPropertyName("repeat_day_of_week")]
    public uint[]? RepeatDayOfWeek { get; set; }
    /// <summary>
    /// Lặp lại vào những ngày nào trong tháng
    /// </summary>
    /// <remarks>
    /// Chỉ có hiệu lực khi chỉ định lặp tùy chỉnh và loại lặp là hàng tháng.
    /// Phạm vi giá trị: 1 ~ 31, lần lượt biểu thị ngày 1~31
    /// </remarks>
    [CanBeNull]
    [JsonProperty("repeat_day_of_month")]
    [JsonPropertyName("repeat_day_of_month")]
    public uint[]? RepeatDayOfMonth { get; set; }
    /// <summary>
    /// Múi giờ.
    /// </summary>
    /// <remarks>
    /// Biểu thị bằng độ lệch UTC (tức số giờ lệch khỏi múi giờ 0), múi giờ phía Đông là số dương, múi giờ phía Tây là số âm.
    /// Ví dụ: +8 biểu thị múi giờ Đông 8 của giờ Bắc Kinh
    /// Mặc định là múi giờ Đông 8 của giờ Bắc Kinh
    /// Phạm vi giá trị: -12 ~ +12
    /// </remarks>
    [CanBeNull]
    [JsonProperty("timezone")]
    [JsonPropertyName("timezone")]
    public uint? TimeZone { get; set; }
    /// <summary>
    /// Danh sách ngày không bao gồm trong lịch trình lặp lại.
    /// </summary>
    /// <remarks>
    /// Khi sửa/xóa một hoặc nhiều ngày cụ thể của lịch trình lặp lại, lịch trình gốc sẽ loại trừ các ngày tương ứng.
    /// </remarks>
    [CanBeNull]
    [JsonProperty("exclude_time_list")]
    [JsonPropertyName("exclude_time_list")]
    public ScheduleReminderExcludeTime[]? ExcludeTimeList { get; set; }
}
