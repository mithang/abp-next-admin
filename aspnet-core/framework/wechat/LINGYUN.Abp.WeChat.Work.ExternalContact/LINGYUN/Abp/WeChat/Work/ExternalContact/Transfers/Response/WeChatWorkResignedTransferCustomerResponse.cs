using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
/// <summary>
/// Kết quả phản hồi phân bổ khách hàng của thành viên đã nghỉ việc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94081" />
/// </remarks>
public class WeChatWorkResignedTransferCustomerResponse : WeChatWorkResponse
{
    /// <summary>
    /// Kết quả phân bổ khách hàng của thành viên đã nghỉ việc
    /// </summary>
    [NotNull]
    [JsonProperty("customer")]
    [JsonPropertyName("customer")]
    public UnassignedTransferCustomer[] Customer { get; set; } = default!;
}
