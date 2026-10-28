using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
/// <summary>
/// Kết quả phản hồi phân bổ khách hàng cho thành viên đang làm việc
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92125" />
/// </remarks>
public class WeChatWorkTransferCustomerResponse : WeChatWorkResponse
{
    /// <summary>
    /// Khách hàng được phân bổ
    /// </summary>
    [NotNull]
    [JsonProperty("customer")]
    [JsonPropertyName("customer")]
    public TransferCustomer[] Customer { get; set; } = default!;
}
