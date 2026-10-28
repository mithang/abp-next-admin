using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
public class TransferCustomerResult
{
    /// <summary>
    /// Userid liên hệ bên ngoài của khách hàng
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
    /// Thời gian tiếp nhận khách hàng; nếu đang ở trạng thái chờ tiếp nhận thì là thời gian tự động tiếp nhận trong tương lai
    /// </summary>
    [NotNull]
    [JsonProperty("takeover_time")]
    [JsonPropertyName("takeover_time")]
    public long TakeoverTime { get; set; }
}
