using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
/// <summary>
/// Tham số yêu cầu gửi đơn xin phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91853"/>
/// </remarks>
public class WeChatWorkApplyEventRequest : WeChatWorkRequest
{
    /// <summary>
    /// Quy trình
    /// </summary>
    /// <remarks>
    /// Bắt buộc khi use_template_approver = 0
    /// </remarks>
    [CanBeNull]
    [JsonProperty("process")]
    [JsonPropertyName("process")]
    public ApprovalApplyProcess? Process { get; set; }
    /// <summary>
    /// Thông tin tóm tắt, dùng để hiển thị trong thẻ thông báo phê duyệt và thông tin tóm tắt của danh sách phê duyệt, tối đa 3 dòng
    /// </summary>
    [CanBeNull]
    [JsonProperty("summary_list")]
    [JsonPropertyName("summary_list")]
    public List<ApprovalSummary>? Summaries { get; set; }
    /// <summary>
    /// Dữ liệu đơn xin phê duyệt, có thể định nghĩa giá trị của từng điều khiển trong đơn xin phê duyệt, trong đó mục bắt buộc phải có giá trị, mục tùy chọn có thể để trống, cấu trúc dữ liệu giống tham số cùng tên “apply_data” trong giá trị trả về của giao diện “Lấy chi tiết đơn xin phê duyệt”
    /// </summary>
    [NotNull]
    [JsonProperty("apply_data")]
    [JsonPropertyName("apply_data")]
    public ApprovalApplyData ApplyData { get; set; }
    /// <summary>
    /// Id mẫu. Có thể lấy trong “Lấy chi tiết đơn xin phê duyệt”, “Thông báo callback khi trạng thái phê duyệt thay đổi”, hoặc trong liên kết trang chỉnh sửa mẫu của mẫu phê duyệt. Tạm thời chưa hỗ trợ gửi đơn phê duyệt mẫu [Bù chấm công][Đổi ca] qua giao diện.
    /// </summary>
    [NotNull]
    [JsonProperty("template_id")]
    [JsonPropertyName("template_id")]
    public string TemplateId { get; set; }
    /// <summary>
    /// Userid của người nộp đơn, đơn xin phê duyệt này sẽ được gửi với tư cách nhân viên này, người nộp đơn phải nằm trong phạm vi hiển thị của ứng dụng
    /// </summary>
    [NotNull]
    [JsonProperty("creator_userid")]
    [JsonPropertyName("creator_userid")]
    public string CreatorUserId { get; set; }
    /// <summary>
    /// Chế độ người phê duyệt
    /// </summary>
    /// <remarks>
    /// 0-Chỉ định người phê duyệt, người nhận bản sao qua giao diện (lúc này tham số process là bắt buộc); <br />
    /// 1-Sử dụng quy trình phê duyệt được đặt cho mẫu này trong trang quản trị (cần đảm bảo quy trình phê duyệt không có nút “Người nộp đơn tự chọn”), hỗ trợ phê duyệt có điều kiện. Mặc định là 0
    /// </remarks>
    [NotNull]
    [JsonProperty("use_template_approver")]
    [JsonPropertyName("use_template_approver")]
    public byte UseTemplateApprover 
    {
        get {
            if (Process == null)
            {
                return 1;
            }
            return 0;
        }
    }
    /// <summary>
    /// Id phòng ban của người lập đơn, không điền sẽ mặc định là phòng ban chính
    /// </summary>
    [CanBeNull]
    [JsonProperty("choose_department")]
    [JsonPropertyName("choose_department")]
    public byte? ChooseDepartment { get; set; }
    public WeChatWorkApplyEventRequest(
        string templateId,
        string creatorUserid,
        ApprovalApplyData applyData,
        ApprovalApplyProcess? process = null,
        byte? chooseDepartment = null)
    {
        TemplateId = templateId;
        ApplyData = applyData;
        CreatorUserId = creatorUserid;
        ChooseDepartment = chooseDepartment;
        Process = process;
    }
}
