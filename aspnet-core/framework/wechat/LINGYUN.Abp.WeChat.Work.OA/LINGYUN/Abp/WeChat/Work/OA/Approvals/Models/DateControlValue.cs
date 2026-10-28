using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển ngày/ngày + giờ
/// </summary>
public class DateControlValue : ControlValue
{
    /// <summary>
    /// Nội dung số tiền, điền tại đây giá trị nhập của điều khiển số tiền
    /// </summary>
    [NotNull]
    [JsonProperty("date")]
    [JsonPropertyName("date")]
    public DateValue Date { get; set; } = default!;
    public DateControlValue()
    {

    }

    public DateControlValue(DateValue date)
    {
        Date = date;
    }
}

public class DateValue
{
    /// <summary>
    /// Loại hiển thị thời gian: day-Ngày; hour-Ngày + giờ, nhất quán với thuộc tính điều khiển mẫu tương ứng
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// Dấu thời gian - kiểu chuỗi, điền tại đây giá trị đã chọn của điều khiển ngày/ngày + giờ, lấy giá trị này làm chuẩn
    /// </summary>
    [NotNull]
    [JsonProperty("s_timestamp")]
    [JsonPropertyName("s_timestamp")]
    public string Timestamp { get; set; } = default!;
    public DateValue()
    {

    }

    private DateValue(string type, string timestamp)
    {
        Type = type;
        Timestamp = timestamp;
    }

    public static DateValue Day(string timestamp)
    {
        return new DateValue("day", timestamp);
    }

    public static DateValue Hour(string timestamp)
    {
        return new DateValue("hour", timestamp);
    }
}
