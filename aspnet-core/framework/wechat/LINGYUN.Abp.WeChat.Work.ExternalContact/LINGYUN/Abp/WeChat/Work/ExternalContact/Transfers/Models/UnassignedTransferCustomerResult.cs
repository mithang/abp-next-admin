using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
/// <summary>
/// Kết quả trạng thái tiếp nhận khách hàng của thành viên đã nghỉ việc được phân bổ
/// </summary>
public class UnassignedTransferCustomerResult
{
    /// <summary>
    /// userid liên hệ bên ngoài của khách hàng được chuyển tiếp
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string ExternalUserid { get; set; } = default!;
    /// <summary>
    /// Trạng thái tiếp nhận
    /// </summary>
    [NotNull]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public TransferStatus Status { get; set; }
    /// <summary>
    /// Thời gian tiếp nhận khách hàng, nếu là trạng thái chờ tiếp nhận thì là thời gian tự động tiếp nhận trong tương lai
    /// </summary>
    [NotNull]
    [JsonProperty("takeover_time")]
    [JsonPropertyName("takeover_time")]
    public long TakeoverTime { get; set; }
}
