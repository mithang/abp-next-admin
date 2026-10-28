using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu lấy phạm vi quản lý của nhóm quy tắc
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/94883#%E8%8E%B7%E5%8F%96%E8%A7%84%E5%88%99%E7%BB%84%E7%AE%A1%E7%90%86%E8%8C%83%E5%9B%B4" />
/// </remarks>
public class WeChatWorkGetCustomerStrategyRangeRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; }
    /// <summary>
    /// Con trỏ truy vấn phân trang, lần gọi đầu tiên có thể không điền
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; }
    /// <summary>
    /// Số nút thành viên/phòng ban trên mỗi trang, mặc định là 1000, tối đa là 1000
    /// </summary>
    [CanBeNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int? Limit { get; }
    public WeChatWorkGetCustomerStrategyRangeRequest(int strategyId, string? cursor = null, int? limit = 1000)
    {
        if (limit.HasValue)
        {
            Check.Range(limit.Value, nameof(limit), 1, 1000);
        }

        StrategyId = strategyId;
        Cursor = cursor;
        Limit = limit;
    }
}
