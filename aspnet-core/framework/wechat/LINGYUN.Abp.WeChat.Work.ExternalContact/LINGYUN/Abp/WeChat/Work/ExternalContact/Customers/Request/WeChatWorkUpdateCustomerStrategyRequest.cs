using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu chỉnh sửa nhóm quy tắc và phạm vi quản lý của nhóm
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/94883#%E7%BC%96%E8%BE%91%E8%A7%84%E5%88%99%E7%BB%84%E5%8F%8A%E5%85%B6%E7%AE%A1%E7%90%86%E8%8C%83%E5%9B%B4" />
/// </remarks>
public class WeChatWorkUpdateCustomerStrategyRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_id")]
    [JsonPropertyName("strategy_id")]
    public int StrategyId { get; }
    /// <summary>
    /// Tên nhóm quy tắc
    /// </summary>
    [CanBeNull]
    [JsonProperty("strategy_name")]
    [JsonPropertyName("strategy_name")]
    public string? StrategyName { get; set; }
    /// <summary>
    /// Danh sách userid quản trị viên nhóm quy tắc
    /// </summary>
    [CanBeNull]
    [JsonProperty("admin_list")]
    [JsonPropertyName("admin_list")]
    public string[]? AdminList { get; set; }
    /// <summary>
    /// Quyền nhóm quy tắc
    /// </summary>
    [CanBeNull]
    [JsonProperty("privilege")]
    [JsonPropertyName("privilege")]
    public CustomerStrategyPrivilege? Privilege { get; set; }
    /// <summary>
    /// Thêm phạm vi quản lý
    /// </summary>
    [NotNull]
    [JsonProperty("range_add")]
    [JsonPropertyName("range_add")]
    public List<CustomerStrategyRange> CreateRange { get; private set; }
    /// <summary>
    /// Xóa phạm vi quản lý
    /// </summary>
    [NotNull]
    [JsonProperty("range_del")]
    [JsonPropertyName("range_del")]
    public List<CustomerStrategyRange> DeleteRange { get; private set; }
    public WeChatWorkUpdateCustomerStrategyRequest(
        int strategyId, 
        string? strategyName = null, 
        string[]? adminList = null, 
        CustomerStrategyPrivilege? privilege = null)
    {
        Check.NotDefaultOrNull<int>(strategyId, nameof(strategyId));

        StrategyId = strategyId;
        StrategyName = strategyName;
        AdminList = adminList;
        Privilege = privilege;

        CreateRange = new List<CustomerStrategyRange>();
        DeleteRange = new List<CustomerStrategyRange>();
    }
}
