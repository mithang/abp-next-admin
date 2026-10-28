using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Điều kiện lọc
/// </summary>
public class ApprovalInfoFilter
{
    /// <summary>
    /// Loại lọc
    /// </summary>
    /// <remarks>
    /// Bao gồm các giá trị sau:<br />
    /// template_id - Loại mẫu / id mẫu;<br />
    /// creator - Người nộp đơn;<br />
    /// department - Phòng ban của người nộp đơn phê duyệt;<br />
    /// sp_status - Trạng thái phê duyệt;<br />
    /// record_type - Thuộc tính loại đơn phê duyệt;<br />
    /// <br />
    /// Lưu ý:<br />
    /// 1. Chỉ “phòng ban” hỗ trợ cấu hình nhiều điều kiện lọc cùng lúc.<br />
    /// 2. Giữa các điều kiện lọc khác loại là quan hệ “và”, giữa các điều kiện lọc cùng loại là quan hệ “hoặc”<br />
    /// 3. Loại lọc record_type chỉ hỗ trợ các đơn phê duyệt mới nộp sau ngày 2021/05/31, các đơn cũ không hỗ trợ lọc theo thuộc tính loại biểu mẫu<br />
    /// </remarks>
    [NotNull]
    [JsonProperty("key")]
    [JsonPropertyName("key")]
    public string Key { get; set; }
    /// <summary>
    /// Giá trị lọc
    /// </summary>
    /// <remarks>
    /// Giá trị tương ứng:<br />
    /// template_id - id mẫu;<br />
    /// creator - userid của người nộp đơn;<br />
    /// department - id phòng ban sở tại;<br />
    /// sp_status - trạng thái đơn phê duyệt (1 - đang phê duyệt; 2 - đã thông qua; 3 - đã bị từ chối; 4 - đã thu hồi; 6 - thu hồi sau khi thông qua; 7 - đã xóa; 10 - đã thanh toán);<br />
    /// record_type - thuộc tính loại đơn phê duyệt (1 - xin nghỉ phép; 2 - chấm công bù; 3 - công tác; 4 - ra ngoài; 5 - tăng ca; 6 - đổi ca; 7 - đặt phòng họp; 8 - phê duyệt hoàn tiền; 9 - phê duyệt hoàn trả hồng bao)<br />
    /// </remarks>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string Value { get; set; }
    public ApprovalInfoFilter(string key, string value)
    {
        Key = key;
        Value = value;
    }
}
