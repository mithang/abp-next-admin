using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách nhóm quy tắc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94883#%E8%8E%B7%E5%8F%96%E8%A7%84%E5%88%99%E7%BB%84%E5%88%97%E8%A1%A8" />
/// </remarks>
public class WeChatWorkGetCustomerStrategyListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Con trỏ truy vấn phân trang, lần gọi đầu tiên có thể không điền
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; }
    /// <summary>
    /// Kích thước trang, mặc định là 1000, tối đa không vượt quá 1000
    /// </summary>
    [CanBeNull]
    [JsonProperty("limit")]
    [JsonPropertyName("limit")]
    public int? Limit { get; }
    public WeChatWorkGetCustomerStrategyListRequest(string? cursor = null, int? limit = 1000)
    {
        if (limit.HasValue)
        {
            Check.Range(limit.Value, nameof(limit), 1, 1000);
        }

        Cursor = cursor;
        Limit = limit;
    }
}
