using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Chi tiết đơn phê duyệt
/// </summary>
public class ApprovalDetailInfo
{
    /// <summary>
    /// Số phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("sp_no")]
    [JsonPropertyName("sp_no")]
    public string SpNo { get; set; } = default!;
    /// <summary>
    /// Tên loại đơn phê duyệt (tên mẫu phê duyệt)
    /// </summary>
    [NotNull]
    [JsonProperty("sp_name")]
    [JsonPropertyName("sp_name")]
    public string SpName { get; set; } = default!;
    /// <summary>
    /// Trạng thái đơn
    /// </summary>
    [NotNull]
    [JsonProperty("sp_status")]
    [JsonPropertyName("sp_status")]
    public ApprovalSpStatus SpStatus { get; set; }
    /// <summary>
    /// Id mẫu phê duyệt. Có thể lấy trong “Lấy chi tiết đơn phê duyệt”, “Thông báo callback khi trạng thái phê duyệt thay đổi”, cũng có thể lấy trong liên kết trang chỉnh sửa mẫu của mẫu phê duyệt.
    /// </summary>
    [NotNull]
    [JsonProperty("template_id")]
    [JsonPropertyName("template_id")]
    public string TemplateId { get; set; } = default!;
    /// <summary>
    /// Thời gian nộp đơn phê duyệt, dấu thời gian Unix
    /// </summary>
    [NotNull]
    [JsonProperty("apply_time")]
    [JsonPropertyName("apply_time")]
    public long ApplyTime { get; set; }
    /// <summary>
    /// Thông tin người nộp đơn
    /// </summary>
    [CanBeNull]
    [JsonProperty("applyer")]
    [JsonPropertyName("applyer")]
    public ApprovalApplyer? Applyer { get; set; }
    /// <summary>
    /// Thông tin người nộp đơn hàng loạt (loại trừ lẫn nhau với trường applyer)
    /// </summary>
    [CanBeNull]
    [JsonProperty("batch_applyer")]
    [JsonPropertyName("batch_applyer")]
    public List<ApprovalUser>? BatchApplyer { get; set; }
    /// <summary>
    /// Thông tin quy trình phê duyệt, có thể có nhiều nút phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("sp_record")]
    [JsonPropertyName("sp_record")]
    public List<ApprovalSpRecord> SpRecord { get; set; } = default!;
    /// <summary>
    /// Thông tin gửi bản sao, có thể có nhiều nút gửi bản sao
    /// </summary>
    [CanBeNull]
    [JsonProperty("notifyer")]
    [JsonPropertyName("notifyer")]
    public List<ApprovalUser>? Notifyer { get; set; }
    /// <summary>
    /// Dữ liệu đơn phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("apply_data")]
    [JsonPropertyName("apply_data")]
    public ApprovalData ApplyData { get; set; } = default!;
    /// <summary>
    /// Thông tin ghi chú của đơn phê duyệt, có thể có nhiều nút ghi chú
    /// </summary>
    [NotNull]
    [JsonProperty("comments")]
    [JsonPropertyName("comments")]
    public List<ApprovalComment> Comments { get; set; } = default!;
    /// <summary>
    /// Danh sách quy trình phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("process_list")]
    [JsonPropertyName("process_list")]
    public ApprovalProcess Process { get; set; } = default!;
}
