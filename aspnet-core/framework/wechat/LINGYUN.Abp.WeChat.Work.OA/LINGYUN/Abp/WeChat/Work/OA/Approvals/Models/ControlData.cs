using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Chi tiết đơn xin phê duyệt
/// </summary>
public class ControlData
{
    /// <summary>
    /// Loại điều khiển
    /// </summary>
    /// <remarks>
    /// Text-văn bản<br />
    /// Textarea-văn bản nhiều dòng<br />
    /// Number-số<br />
    /// Money-số tiền<br />
    /// Date-ngày/ngày + giờ<br />
    /// Selector-chọn một / chọn nhiều<br />
    /// Contact-thành viên / phòng ban<br />
    /// Tips-văn bản giải thích<br />
    /// File-tệp đính kèm<br />
    /// Table-chi tiết<br />
    /// Location-vị trí<br />
    /// RelatedApproval-đơn phê duyệt liên quan<br />
    /// Formula-công thức<br />
    /// DateRange-khoảng thời gian
    /// </remarks>
    [NotNull]
    [JsonProperty("control")]
    [JsonPropertyName("control")]
    public string Control { get; set; } = default!;
    /// <summary>
    /// Id điều khiển: id duy nhất của điều khiển, có thể lấy qua API “Lấy chi tiết mẫu phê duyệt”
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;
    /// <summary>
    /// Giá trị điều khiển, cần điền tại đây nội dung người nộp đơn nhập trong từng điều khiển; các điều khiển khác nhau có tham số gán giá trị khác nhau
    /// </summary>
    /// <remarks>
    /// Khi thuộc tính điều khiển được cấu hình trong mẫu là bắt buộc, giá trị value tương ứng cần có giá trị.
    /// </remarks>
    [CanBeNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public ControlValue? Value { get; set; }
    public ControlData()
    {

    }

    private ControlData(string id, string control, ControlValue? value = null)
    {
        Id = id;
        Control = control;
        Value = value;
    }

    /// <summary>
    /// Tạo một điều khiển Text
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Text(string id, TextControlValue value)
    {
        return new ControlData(id, "Text", value);
    }
    /// <summary>
    /// Tạo một điều khiển Textarea
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Textarea(string id, TextareaControlValue value)
    {
        return new ControlData(id, "Textarea", value);
    }
    /// <summary>
    /// Tạo một điều khiển Number
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Number(string id, NumberControlValue value)
    {
        return new ControlData(id, "Number", value);
    }
    /// <summary>
    /// Tạo một điều khiển Money
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Money(string id, MoneyControlValue value)
    {
        return new ControlData(id, "Money", value);
    }
    /// <summary>
    /// Tạo một điều khiển Date
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Date(string id, DateControlValue value)
    {
        return new ControlData(id, "Date", value);
    }
    /// <summary>
    /// Tạo một điều khiển Selector
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Selector(string id, SelectorControlValue value)
    {
        return new ControlData(id, "Selector", value);
    }
    /// <summary>
    /// Tạo một điều khiển Contact
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Contact(string id, ContactControlValue value)
    {
        return new ControlData(id, "Contact", value);
    }
    /// <summary>
    /// Tạo một điều khiển Tips
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <returns></returns>
    public static ControlData Tips(string id)
    {
        return new ControlData(id, "Tips", null);
    }
    /// <summary>
    /// Tạo một điều khiển File
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData File(string id, FileControlValue value)
    {
        return new ControlData(id, "File", value);
    }
    /// <summary>
    /// Tạo một điều khiển Table
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Table(string id, TableControlValue value)
    {
        return new ControlData(id, "Table", value);
    }
    /// <summary>
    /// Tạo một điều khiển Location
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Location(string id, LocationControlValue value)
    {
        return new ControlData(id, "Location", value);
    }
    /// <summary>
    /// Tạo một điều khiển RelatedApproval
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData RelatedApproval(string id, RelatedApprovalControlValue value)
    {
        return new ControlData(id, "RelatedApproval", value);
    }
    /// <summary>
    /// Tạo một điều khiển Formula
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData Formula(string id, FormulaControlValue value)
    {
        return new ControlData(id, "Formula", value);
    }
    /// <summary>
    /// Tạo một điều khiển DateRange
    /// </summary>
    /// <param name="id">Id điều khiển</param>
    /// <param name="value">Giá trị điều khiển</param>
    /// <returns></returns>
    public static ControlData DateRange(string id, DateRangeControlValue value)
    {
        return new ControlData(id, "DateRange", value);
    }
}
