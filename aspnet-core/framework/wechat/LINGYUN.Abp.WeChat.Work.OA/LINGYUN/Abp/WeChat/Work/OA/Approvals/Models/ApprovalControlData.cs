using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Dữ liệu điều khiển của đơn xin phê duyệt
/// </summary>
public class ApprovalControlData
{
    /// <summary>
    /// Loại điều khiển
    /// </summary>
    /// <remarks>
    /// Text - Văn bản<br />
    /// Textarea - Văn bản nhiều dòng<br />
    /// Number - Số<br />
    /// Money - Số tiền<br />
    /// Date - Ngày / Ngày + giờ<br />
    /// Selector - Chọn một / Chọn nhiều<br />
    /// Contact - Thành viên / Phòng ban<br />
    /// Tips - Văn bản giải thích<br />
    /// File - Tệp đính kèm<br />
    /// Table - Chi tiết<br />
    /// Location - Vị trí<br />
    /// RelatedApproval - Đơn phê duyệt liên quan<br />
    /// Formula - Công thức<br />
    /// DateRange - Khoảng thời gian
    /// </remarks>
    [NotNull]
    [JsonProperty("control")]
    [JsonPropertyName("control")]
    public string Control { get; set; } = default!;
    /// <summary>
    /// ID điều khiển: ID duy nhất của điều khiển, có thể lấy qua giao diện “Lấy chi tiết mẫu phê duyệt”
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;
    /// <summary>
    /// Giá trị điều khiển, cần điền tại đây nội dung người nộp đơn nhập vào từng điều khiển; các điều khiển khác nhau có tham số gán giá trị khác nhau
    /// </summary>
    /// <remarks>
    /// Khi thuộc tính điều khiển được cấu hình trong mẫu là bắt buộc, giá trị value tương ứng cần phải có giá trị.
    /// </remarks>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public ApprovalControlValue Value { get; set; } = default!;
    /// <summary>
    /// Cờ ẩn điều khiển, bằng 1 nghĩa là điều khiển bị ẩn
    /// </summary>
    [CanBeNull]
    [JsonProperty("display")]
    [JsonPropertyName("display")]
    public int? Display { get; set; }
    /// <summary>
    /// Cờ bắt buộc nhập của điều khiển, bằng 1 nghĩa là điều khiển bắt buộc phải nhập
    /// </summary>
    [CanBeNull]
    [JsonProperty("require")]
    [JsonPropertyName("require")]
    public int? Require { get; set; }
}
