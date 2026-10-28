using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết nhóm quy tắc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94883" />
/// </remarks>
public class WeChatWorkGetCustomerStrategyResponse : WeChatWorkResponse
{
    /// <summary>
    /// Chi tiết nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy")]
    [JsonPropertyName("strategy")]
    public CustomerStrategyInfo Strategy { get; set; } = default!;
}
