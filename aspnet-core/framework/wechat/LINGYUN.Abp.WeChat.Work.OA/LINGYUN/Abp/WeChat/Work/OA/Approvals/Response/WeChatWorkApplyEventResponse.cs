using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Response;
/// <summary>
/// Tham số phản hồi gửi đơn xin phê duyệt
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/91853"/>
/// </remarks>
public class WeChatWorkApplyEventResponse : WeChatWorkResponse
{
    /// <summary>
    /// Sau khi gửi biểu mẫu thành công, số biểu mẫu được trả về
    /// </summary>
    [NotNull]
    [JsonProperty("sp_no")]
    [JsonPropertyName("sp_no")]
    public string SpNo { get; set; } = default!;
}
