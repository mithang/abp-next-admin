using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
/// <summary>
/// Tham số yêu cầu lấy hàng loạt số đơn phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91816"/>
/// </remarks>
public class WeChatWorkGetApprovalInfoRequest : WeChatWorkRequest
{
    /// <summary>
    /// Khoảng thời gian nộp đơn phê duyệt, thời gian bắt đầu, dấu thời gian Unix
    /// </summary>
    [NotNull]
    [JsonProperty("starttime")]
    [JsonPropertyName("starttime")]
    public long StartTime { get; set; }
    /// <summary>
    /// Khoảng thời gian nộp đơn phê duyệt, thời gian kết thúc, dấu thời gian Unix
    /// </summary>
    [NotNull]
    [JsonProperty("endtime")]
    [JsonPropertyName("endtime")]
    public long EndTime { get; set; }
    /// <summary>
    /// Con trỏ phân trang truy vấn, mặc định là chuỗi rỗng, sau đó dùng new_next_cursor trả về để lấy dữ liệu phân trang
    /// </summary>
    [CanBeNull]
    [JsonProperty("new_cursor")]
    [JsonPropertyName("new_cursor")]
    public string? NewCursor { get; set; } = "";
    /// <summary>
    /// Số lượng đơn phê duyệt lấy trong một yêu cầu, giá trị mặc định là 100, giá trị tối đa là 100.
    /// Nếu accesstoken thuộc ứng dụng tự xây dựng, chỉ được phép lấy các biểu mẫu do người nộp đơn gửi trong phạm vi hiển thị của ứng dụng, số lượng sp_no_list trả về có thể không khớp với size, nhà phát triển cần dùng next_cursor để xác định đã lấy hết bản ghi biểu mẫu hay chưa
    /// </summary>
    [NotNull]
    [JsonProperty("size")]
    [JsonPropertyName("size")]
    public int Size { get; set; }
    /// <summary>
    /// Điều kiện lọc, có thể đặt ràng buộc cho các đơn phê duyệt lấy hàng loạt, hỗ trợ đặt nhiều điều kiện
    /// </summary>
    [CanBeNull]
    [JsonProperty("filters")]
    [JsonPropertyName("filters")]
    public List<ApprovalInfoFilter>? Filters { get; set; }
    public WeChatWorkGetApprovalInfoRequest(
        long sartTime,
        long endTime,
        int size = 100,
        List<ApprovalInfoFilter>? filters = null)
    {
        StartTime = sartTime;
        EndTime = endTime;
        Size = Check.Range(size, nameof(size), 1, 100);

        Filters = filters;
    }
}
