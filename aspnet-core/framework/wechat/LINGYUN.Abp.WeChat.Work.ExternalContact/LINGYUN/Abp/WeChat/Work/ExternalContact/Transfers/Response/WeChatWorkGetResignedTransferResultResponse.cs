using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
/// <summary>
/// Kết quả phản hồi truy vấn trạng thái tiếp nhận khách hàng của nhân viên đã nghỉ việc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94082" />
/// </remarks>
public class WeChatWorkGetResignedTransferResultResponse : WeChatWorkResponse
{
    /// <summary>
    /// Khách hàng được chuyển tiếp
    /// </summary>
    [NotNull]
    [JsonProperty("customer")]
    [JsonPropertyName("customer")]
    public UnassignedTransferCustomerResult[] Customer { get; set; } = default!;
    /// <summary>
    /// cursor bắt đầu của trang tiếp theo
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
}
