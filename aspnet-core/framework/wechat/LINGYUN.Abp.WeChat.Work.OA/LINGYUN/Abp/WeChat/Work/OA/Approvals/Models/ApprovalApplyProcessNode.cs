using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Nút quy trình phê duyệt
/// </summary>
public class ApprovalApplyProcessNode
{
    /// <summary>
    /// Loại nút 1: người phê duyệt 2: người nhận bản sao 3: người xử lý
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public ApprovalProcessNodeType Type { get; set; }
    /// <summary>
    /// Phương thức phê duyệt nhiều người 1 - đồng ký; 2 - hoặc ký 3 - phê duyệt lần lượt
    /// </summary>
    /// <remarks>
    /// Bắt buộc khi type là 1, 3
    /// </remarks>
    [NotNull]
    [JsonProperty("apv_rel")]
    [JsonPropertyName("apv_rel")]
    public byte? ApvRel { get; set; }
    /// <summary>
    /// Id người dùng
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    public ApprovalApplyProcessNode()
    {

    }

    private ApprovalApplyProcessNode(ApprovalProcessNodeType type, string userId, byte? apvRel = null)
    {
        Type = type;
        UserId = userId;
        ApvRel = apvRel;
    }
    /// <summary>
    /// Nút người phê duyệt
    /// </summary>
    /// <param name="userId">Id người phê duyệt</param>
    /// <param name="apvRel">Phương thức phê duyệt nhiều người 1 - đồng ký; 2 - hoặc ký 3 - phê duyệt lần lượt</param>
    /// <returns></returns>
    public static ApprovalApplyProcessNode Approver(string userId, byte apvRel)
    {
        return new ApprovalApplyProcessNode(ApprovalProcessNodeType.Approver, userId, apvRel);
    }
    /// <summary>
    /// Nút người xử lý
    /// </summary>
    /// <param name="userId">Id người xử lý</param>
    /// <param name="apvRel">Phương thức phê duyệt nhiều người 1 - đồng ký; 2 - hoặc ký 3 - phê duyệt lần lượt</param>
    /// <returns></returns>
    public static ApprovalApplyProcessNode Handler(string userId, byte apvRel)
    {
        return new ApprovalApplyProcessNode(ApprovalProcessNodeType.Handler, userId, apvRel);
    }
    /// <summary>
    /// Nút người nhận bản sao
    /// </summary>
    /// <param name="userId">Id người nhận bản sao</param>
    /// <returns></returns>
    public static ApprovalApplyProcessNode To(string userId)
    {
        return new ApprovalApplyProcessNode(ApprovalProcessNodeType.CC, userId);
    }
}
