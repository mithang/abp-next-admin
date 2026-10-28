using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
public class UnassignedCustomerInfo
{
    /// <summary>
    /// userid của thành viên đã nghỉ việc
    /// </summary>
    [NotNull]
    [JsonProperty("handover_userid")]
    [JsonPropertyName("handover_userid")]
    public string HandoverUserid { get; set; } = default!;
    /// <summary>
    /// userid liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string ExternalUserid { get; set; } = default!;
    /// <summary>
    /// Thời gian thành viên nghỉ việc
    /// </summary>
    [NotNull]
    [JsonProperty("dimission_time")]
    [JsonPropertyName("dimission_time")]
    public long DimissionTime { get; set; }
}
