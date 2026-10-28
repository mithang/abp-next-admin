using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Phạm vi quản lý nhóm quy tắc
/// </summary>
public class CustomerStrategyRange
{
    /// <summary>
    /// Loại nút
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public CustomerStrategyRangeType Type { get; set; }
    /// <summary>
    /// userid thành viên được cấu hình trong phạm vi quản lý, chỉ trả về khi Type là<see cref="CustomerStrategyRangeType.Member"/> thì trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string? UserId { get; set; }
    /// <summary>
    /// partyid phòng ban được cấu hình trong phạm vi quản lý, chỉ trả về khi Type là<see cref="CustomerStrategyRangeType.Part"/> thì trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("partyid")]
    [JsonPropertyName("partyid")]
    public int? PartyId { get; set; }

    public CustomerStrategyRange()
    {

    }

    private CustomerStrategyRange(
        CustomerStrategyRangeType type, 
        string? userId = null, 
        int? partyId = null)
    {
        Type = type;
        UserId = userId;
        PartyId = partyId;
    }

    public static CustomerStrategyRange Member(string userId)
    {
        Check.NotNullOrWhiteSpace(userId, nameof(userId));

        return new CustomerStrategyRange(CustomerStrategyRangeType.Member, userId);
    }
    public static CustomerStrategyRange Party(int partyId)
    {
        Check.NotDefaultOrNull<int>(partyId, nameof(partyId));

        return new CustomerStrategyRange(CustomerStrategyRangeType.Part, partyId: partyId);
    }
}
