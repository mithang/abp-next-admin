using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách nhóm khách hàng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92120" />
/// </remarks>
public class WeChatWorkGetGroupChatListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Lọc theo trạng thái theo dõi nhóm khách hàng
    /// </summary>
    [CanBeNull]
    [JsonProperty("status_filter")]
    [JsonPropertyName("status_filter")]
    public StatusFilter? StatusFilter { get; set; }
    /// <summary>
    /// Lọc theo trạng thái theo dõi nhóm khách hàng
    /// </summary>
    [CanBeNull]
    [JsonProperty("owner_filter")]
    [JsonPropertyName("owner_filter")]
    public OwnerFilter[]? OwnerFilter { get; set; }
    /// <summary>
    /// Con trỏ dùng cho truy vấn phân trang, kiểu chuỗi, do lần gọi trước trả về, lần gọi đầu tiên không điền
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; set; }
    /// <summary>
    /// Phân trang, lượng dữ liệu dự kiến yêu cầu, phạm vi giá trị 1 ~ 1000
    /// </summary>
    [CanBeNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int Limit { get; }
    public WeChatWorkGetGroupChatListRequest(int limit = 1000)
    {
        Check.Range(limit, nameof(limit), 1, 1000);

        Limit = limit;
    }
}
