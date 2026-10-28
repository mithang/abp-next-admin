using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Chi tiết lịch
/// </summary>
public class CalendarInfo
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [NotNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string CalId { get; set; } = default!;
    /// <summary>
    /// Danh sách userid quản trị viên của lịch
    /// </summary>
    [NotNull]
    [JsonProperty("admins")]
    [JsonPropertyName("admins")]
    public string[] Admins { get; set; } = default!;
    /// <summary>
    /// Tiêu đề lịch. 1 ~ 128 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("summary")]
    [JsonPropertyName("summary")]
    public string Summary { get; set; } = default!;
    /// <summary>
    /// Màu lịch, biểu diễn bằng mã hex của mã màu RGB, ví dụ: "#0000FF" biểu thị màu xanh dương thuần
    /// </summary>
    [NotNull]
    [JsonProperty("color")]
    [JsonPropertyName("color")]
    public string Color { get; set; } = default!;
    /// <summary>
    /// Mô tả lịch. 0 ~ 512 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Có phải lịch công khai không.
    /// </summary>
    [NotNull]
    [JsonProperty("is_public")]
    [JsonPropertyName("is_public")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsPublic { get; set; }
    /// <summary>
    /// Phạm vi công khai. Chỉ có hiệu lực khi là lịch công khai
    /// </summary>
    [CanBeNull]
    [JsonProperty("public_range")]
    [JsonPropertyName("public_range")]
    public CalendarPublicRange? PublicRange { get; set; }
    /// <summary>
    /// Có phải lịch toàn công ty không.
    /// </summary>
    [NotNull]
    [JsonProperty("is_corp_calendar")]
    [JsonPropertyName("is_corp_calendar")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsCorpCalendar { get; set; }
    /// <summary>
    /// Danh sách thành viên trong phạm vi thông báo của lịch. Tối đa 2000 người
    /// </summary>
    [NotNull]
    [JsonProperty("shares")]
    [JsonPropertyName("shares")]
    public CalendarShare[] Shares { get; set; } = default!;
}
