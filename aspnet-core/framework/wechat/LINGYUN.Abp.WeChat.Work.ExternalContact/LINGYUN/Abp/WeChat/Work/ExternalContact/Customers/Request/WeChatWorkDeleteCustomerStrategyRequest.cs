using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu xóa nhóm quy tắc
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/94883#%E5%88%A0%E9%99%A4%E8%A7%84%E5%88%99%E7%BB%84" />
/// </remarks>
public class WeChatWorkDeleteCustomerStrategyRequest : WeChatWorkRequest
{
    /// <summary>
    /// id nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; }
    public WeChatWorkDeleteCustomerStrategyRequest(int strategyId)
    {
        Check.NotDefaultOrNull<int>(strategyId, nameof(strategyId));

        StrategyId = strategyId;
    }
}
