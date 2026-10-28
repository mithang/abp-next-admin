using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị thành phần xin nghỉ phép thuộc thành phần chấm công/nghỉ phép
/// </summary>
public class VacationControlValue : ControlValue
{
    /// <summary>
    /// Nội dung xin nghỉ phép, tức thông tin nghỉ phép mà người nộp đơn đã chọn trong thành phần này
    /// </summary>
    [NotNull]
    [JsonProperty("vacation")]
    [JsonPropertyName("vacation")]
    public VacationValue Vacation { get; set; } = default!;
    public VacationControlValue()
    {

    }

    public VacationControlValue(VacationValue vacation)
    {
        Vacation = vacation;
    }
}

public class VacationValue
{
    /// <summary>
    /// Loại nghỉ phép; tùy chọn đã chọn liên kết với quản lý kỳ nghỉ, là loại kỳ nghỉ trong quản lý kỳ nghỉ
    /// </summary>
    [NotNull]
    [JsonProperty("selector")]
    [JsonPropertyName("selector")]
    public VacationSelector Selector { get; set; } = default!;
    /// <summary>
    /// Thành phần chấm công/nghỉ phép
    /// </summary>
    [NotNull]
    [JsonProperty("attendance")]
    [JsonPropertyName("attendance")]
    public AttendanceValue Attendance { get; set; } = default!;
    public VacationValue()
    {

    }

    public VacationValue(VacationSelector selector, AttendanceValue attendance)
    {
        Selector = selector;
        Attendance = attendance;
    }
}

public class VacationSelector
{
    /// <summary>
    /// Phương thức chọn: single - chọn đơn; multi - chọn nhiều, trong điều khiển chấm công/nghỉ phép cố định là chọn đơn
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// Tùy chọn người dùng đã chọn
    /// </summary>
    [NotNull]
    [JsonProperty("options")]
    [JsonPropertyName("options")]
    public List<VacationSelectorOption> Options { get; set; } = default!;
    public VacationSelector()
    {

    }

    public VacationSelector(List<VacationSelectorOption> options)
    {
        Type = "single";
        Options = options;
    }
}

public class VacationSelectorOption
{
    /// <summary>
    /// Khóa tùy chọn, id duy nhất của tùy chọn, có thể lấy giá trị id của item trong vacation_list qua giao diện “lấy chi tiết mẫu phê duyệt”
    /// </summary>
    [NotNull]
    [JsonProperty("key")]
    [JsonPropertyName("key")]
    public string Key { get; set; } = default!;
    /// <summary>
    /// Giá trị tùy chọn; nếu đã cấu hình đa ngôn ngữ thì sẽ bao gồm giá trị tùy chọn tiếng Trung và tiếng Anh
    /// </summary>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public VacationSelectorOptionValue Value { get; set; } = default!;
    public VacationSelectorOption()
    {

    }

    public VacationSelectorOption(string key, VacationSelectorOptionValue value)
    {
        Key = key;
        Value = value;
    }
}

public class VacationSelectorOptionValue
{
    /// <summary>
    /// Giá trị tùy chọn
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = default!;
    /// <summary>
    /// Tên đa ngôn ngữ
    /// </summary>
    [NotNull]
    [JsonProperty("lang")]
    [JsonPropertyName("lang")]
    public string Lang { get; set; } = default!;
    public VacationSelectorOptionValue()
    {

    }

    public VacationSelectorOptionValue(string text, string lang = "zh_CN")
    {
        Text = text;
        Lang = lang;
    }
}

