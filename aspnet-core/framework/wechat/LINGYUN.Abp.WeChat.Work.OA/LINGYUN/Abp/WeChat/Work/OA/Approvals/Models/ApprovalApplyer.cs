using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Thông tin người xin phê duyệt
/// </summary>
public class ApprovalApplyer : ApprovalUser
{
    /// <summary>
    /// id phòng ban của người xin phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("partyid")]
    [JsonPropertyName("partyid")]
    public int PartyId { get; set; }
}
