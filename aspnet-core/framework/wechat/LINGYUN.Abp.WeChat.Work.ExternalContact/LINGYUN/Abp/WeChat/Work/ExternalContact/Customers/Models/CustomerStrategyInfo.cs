using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Chi tiết nhóm quy tắc
/// </summary>
public class CustomerStrategyInfo : CustomerStrategy
{
    /// <summary>
    /// Id nhóm quy tắc cha; nếu nhóm quy tắc hiện tại không có nhóm cha thì bằng 0
    /// </summary>
    [NotNull]
    [JsonProperty("parent_id")]
    [JsonPropertyName("parent_id")]
    public int ParentId { get; set; }
    /// <summary>
    /// Tên nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("strategy_name")]
    [JsonPropertyName("strategy_name")]
    public string StrategyName { get; set; } = default!;
    /// <summary>
    /// Dấu thời gian tạo nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("create_time")]
    [JsonPropertyName("create_time")]
    public long CreateTime { get; set; }
    /// <summary>
    /// Danh sách userid quản trị viên của nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("admin_list")]
    [JsonPropertyName("admin_list")]
    public string[] AdminList { get; set; } = default!;
    /// <summary>
    /// Quyền của nhóm quy tắc
    /// </summary>
    [NotNull]
    [JsonProperty("privilege")]
    [JsonPropertyName("privilege")]
    public CustomerStrategyPrivilege Privilege { get; set; } = default!;
}
