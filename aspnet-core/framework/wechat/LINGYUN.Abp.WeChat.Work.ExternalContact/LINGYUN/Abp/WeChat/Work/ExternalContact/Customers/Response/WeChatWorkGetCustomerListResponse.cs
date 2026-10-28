using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92113" />
/// </remarks>
public class WeChatWorkGetCustomerListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách userid của liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public List<string> ExternalUserId { get; set; } = new List<string>();
}
