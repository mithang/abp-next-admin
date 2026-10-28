using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
/// <summary>
/// Chi tiết phân bổ khách hàng của thành viên đã nghỉ việc
/// </summary>
public class UnassignedTransferCustomer
{
    /// <summary>
    /// Userid liên hệ bên ngoài của khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string ExternalUserid { get; set; } = default!;
    /// <summary>
    /// Kết quả phân bổ cho khách hàng này, 0 nghĩa là bắt đầu quy trình phân bổ, sau 24 giờ sẽ tự động tiếp nhận, và không có nghĩa là phân bổ cuối cùng đã thành công
    /// </summary>
    [NotNull]
    [JsonProperty("errcode")]
    [JsonPropertyName("errcode")]
    public int ErrCode { get; set; }
}
