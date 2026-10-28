using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/92114" />
/// </remarks>
public class WeChatWorkGetCustomerResponse : WeChatWorkResponse
{
    /// <summary>
    /// Thông tin liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("external_contact")]
    [JsonPropertyName("external_contact")]
    public ExternalContactInfo ExternalContact { get; set; } = default!;
    /// <summary>
    /// Thành viên doanh nghiệp đã thêm liên hệ bên ngoài này
    /// </summary>
    [NotNull]
    [JsonProperty("follow_user")]
    [JsonPropertyName("follow_user")]
    public List<FollowUser> FollowUser { get; set; } = default!;
    /// <summary>
    /// Cursor phân trang, được trả về khi số người theo dõi nhiều hơn 500 người
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
}
