using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách nhóm quy tắc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94883" />
/// </remarks>
public class WeChatWorkGetCustomerStrategyListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy")]
    [JsonPropertyName("strategy")]
    public CustomerStrategy[] Strategy { get; set; } = default!;
    /// <summary>
    /// Con trỏ phân trang, dùng để truy vấn dữ liệu của trang tiếp theo, không trả về khi không còn dữ liệu nữa
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
}
