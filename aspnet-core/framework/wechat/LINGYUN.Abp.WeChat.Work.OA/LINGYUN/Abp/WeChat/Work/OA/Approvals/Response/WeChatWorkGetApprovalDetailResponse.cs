using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết đơn xin phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91983"/>
/// </remarks>
public class WeChatWorkGetApprovalDetailResponse : WeChatWorkResponse
{
    /// <summary>
    /// Chi tiết đơn xin phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("info")]
    [JsonPropertyName("info")]
    public ApprovalDetailInfo Info { get; set; } = default!;
}
