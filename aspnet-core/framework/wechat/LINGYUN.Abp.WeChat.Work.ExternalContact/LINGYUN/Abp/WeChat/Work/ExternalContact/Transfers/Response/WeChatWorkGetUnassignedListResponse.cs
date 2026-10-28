using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
/// <summary>
/// Kết quả phản hồi lấy danh sách thành viên đã nghỉ việc đang chờ phân công
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/92124" />
/// </remarks>
public class WeChatWorkGetUnassignedListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Khách hàng của thành viên đã nghỉ việc đang chờ phân công
    /// </summary>
    [NotNull]
    [JsonProperty("info")]
    [JsonPropertyName("info")]
    public UnassignedCustomerInfo[] Info { get; set; } = default!;
    /// <summary>
    /// Có phải là bản ghi cuối cùng hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_last")]
    [JsonPropertyName("is_last")]
    public bool IsLast { get; set; }
    /// <summary>
    /// Con trỏ truy vấn phân trang, khi đã truy vấn xong sẽ trả về rỗng (""), không trả về khi dùng page_id làm tham số truy vấn
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
}
