using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
/// <summary>
/// Tham số yêu cầu lấy chi tiết đơn xin phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91983"/>
/// </remarks>
public class WeChatWorkGetApprovalDetailRequest : WeChatWorkRequest
{
    /// <summary>
    /// Số đơn phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("sp_no")]
    [JsonPropertyName("sp_no")]
    public string SpNo { get; set; }
    public WeChatWorkGetApprovalDetailRequest(string spNo)
    {
        SpNo = spNo;
    }
}
