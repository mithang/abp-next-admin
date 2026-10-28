using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
public class TransferCustomer
{
    /// <summary>
    /// userid liên hệ bên ngoài của khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string ExternalUserid { get; set; } = default!;
    /// <summary>
    /// Kết quả phân bổ cho khách hàng này, tham khảo mã lỗi toàn cục; 0 nghĩa là đã khởi tạo chuyển giao thành công, sau 24 giờ sẽ tự động chuyển giao, không có nghĩa là chuyển giao cuối cùng đã thành công
    /// </summary>
    [NotNull]
    [JsonProperty("errcode")]
    [JsonPropertyName("errcode")]
    public int ErrCode { get; set; }
}
