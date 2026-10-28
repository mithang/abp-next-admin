using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
/// <summary>
/// Tham số phản hồi tạo nhóm quy tắc mới
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/94883" />
/// </remarks>
public class WeChatWorkCreateCustomerStrategyResponse : WeChatWorkResponse
{
    /// <summary>
    /// Id nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; set; }
}
