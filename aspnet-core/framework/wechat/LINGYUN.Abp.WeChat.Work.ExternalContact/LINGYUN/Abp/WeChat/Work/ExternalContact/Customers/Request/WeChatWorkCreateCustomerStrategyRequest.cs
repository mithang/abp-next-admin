using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
/// <summary>
/// Tham số yêu cầu lấy hàng loạt chi tiết khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92994" />
/// </remarks>
public class WeChatWorkCreateCustomerStrategyRequest : WeChatWorkRequest
{
    /// <summary>
    /// id nhóm quy tắc cha
    /// </summary>
    [CanBeNull]
    [JsonProperty("parent_id")]
    [JsonPropertyName("parent_id")]
    public int? ParentId { get; set; }
    /// <summary>
    /// Tên nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_name")]
    [JsonPropertyName("strategy_name")]
    public string StrategyName { get; }
    /// <summary>
    /// Danh sách userid quản trị viên nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("admin_list")]
    [JsonPropertyName("admin_list")]
    public string[] AdminList { get; }
    /// <summary>
    /// Quyền của nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("privilege")]
    [JsonPropertyName("privilege")]
    public CustomerStrategyPrivilege Privilege { get; }
    /// <summary>
    /// Phạm vi quản lý của nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("range")]
    [JsonPropertyName("range")]
    public CustomerStrategyRange[] Range { get; }
    public WeChatWorkCreateCustomerStrategyRequest(
        string strategyName,
        string[] adminList,
        CustomerStrategyPrivilege? privilege = null,
        CustomerStrategyRange[]? range = null)
    {
        Check.NotNullOrWhiteSpace(strategyName, nameof(strategyName));
        Check.NotNullOrEmpty(adminList, nameof(adminList));

        if (adminList.Length > 20)
        {
            throw new ArgumentException("Up to 20 admin list can be configured at a time!");
        }
        if (range != null && range.Length > 100)
        {
            throw new ArgumentException("Up to 100 management range can be configured at a time!");
        }

        StrategyName = strategyName;
        AdminList = adminList;
        Privilege = privilege ?? CustomerStrategyPrivilege.Default();
        Range = range ?? [];
    }
}
