using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Thuộc tính điều khiển của mẫu
/// </summary>
public class ControlInfo
{
    /// <summary>
    /// Id điều khiển. 1-Id điều khiển trong mẫu phải là duy nhất; 2-Định dạng id điều khiển: control-số, ví dụ "Text-01"
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;
    /// <summary>
    /// Loại điều khiển
    /// </summary>
    /// <remarks>
    /// Text-Văn bản<br />
    /// Textarea-Văn bản nhiều dòng<br />
    /// Number-Số<br />
    /// Money-Số tiền<br />
    /// Date-Ngày/Ngày + giờ<br />
    /// Selector-Chọn một/Chọn nhiều<br />
    /// Contact-Thành viên/Phòng ban<br />
    /// Tips-Văn bản giải thích<br />
    /// File-Tệp đính kèm<br />
    /// Table-Chi tiết<br />
    /// Location-Vị trí<br />
    /// RelatedApproval-Đơn phê duyệt liên quan<br />
    /// DateRange-Khoảng thời gian<br />
    /// PhoneNumber-Số điện thoại<br />
    /// Vacation-Nghỉ phép<br />
    /// Attendance-Ra ngoài/Công tác/Tăng ca<br />
    /// BankAccount-Tài khoản nhận tiền<br />
    /// Trên đây là các loại điều khiển hiện được hỗ trợ
    /// </remarks>
    [NotNull]
    [JsonProperty("control")]
    [JsonPropertyName("control")]
    public string Control { get; set; } = default!;
    /// <summary>
    /// Tên điều khiển
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public List<ControlTtile> Title { get; set; } = default!;
    /// <summary>
    /// Mô tả điều khiển, các thành phần chấm công nghỉ phép (Vacation, Attendance) tạm thời chưa hỗ trợ thiết lập
    /// </summary>
    [CanBeNull]
    [JsonProperty("placeholder")]
    [JsonPropertyName("placeholder")]
    public List<ControlPlaceholder>? Placeholder { get; set; }
    /// <summary>
    /// Điều khiển có bắt buộc hay không. 0-Không bắt buộc; 1-Bắt buộc; mặc định là 0; các thành phần chấm công nghỉ phép (Vacation, Attendance) không hỗ trợ thiết lập không bắt buộc
    /// </summary>
    [CanBeNull]
    [JsonProperty("require")]
    [JsonPropertyName("require")]
    public byte Require { get; set; }
    /// <summary>
    /// Điều khiển có thể in được hay không. 0-Có thể in; 1-Không thể in; mặc định là 0; các thành phần chấm công nghỉ phép (Vacation, Attendance) không hỗ trợ thiết lập không thể in
    /// </summary>
    [CanBeNull]
    [JsonProperty("un_print")]
    [JsonPropertyName("un_print")]
    public byte UnPrint { get; set; }
    /// <summary>
    /// un_replace
    /// </summary>
    [CanBeNull]
    [JsonProperty("un_replace")]
    [JsonPropertyName("un_replace")]
    public byte UnReplace { get; set; }
    /// <summary>
    /// inner_id
    /// </summary>
    [CanBeNull]
    [JsonProperty("inner_id")]
    [JsonPropertyName("inner_id")]
    public string? InnerId { get; set; }
    /// <summary>
    /// Điều khiển có bị ẩn hay không
    /// </summary>
    [CanBeNull]
    [JsonProperty("display")]
    [JsonPropertyName("display")]
    public byte Display { get; set; }
}
