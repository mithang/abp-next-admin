using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Response;
/// <summary>
/// Tham số phản hồi lấy hàng loạt mã đơn phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/91816"/>
/// </remarks>
public class WeChatWorkGetApprovalInfoResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách mã đơn phê duyệt, bao gồm các đơn phê duyệt thỏa mãn điều kiện
    /// </summary>
    [NotNull]
    [JsonProperty("sp_no_list")]
    [JsonPropertyName("sp_no_list")]
    public List<string> SpNos { get; set; } = default!;
    /// <summary>
    /// Con trỏ cho lần truy vấn tiếp theo, khi kết quả trả về không có trường này nghĩa là đã lấy hết đơn phê duyệt
    /// </summary>
    [CanBeNull]
    [JsonProperty("new_next_cursor")]
    [JsonPropertyName("new_next_cursor")]
    public string? NewNextCursor { get; set; }
}
