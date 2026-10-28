using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
/// <summary>
/// Tham số yêu cầu lấy mẫu phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91982"/>
/// </remarks>
public class WeChatWorkGetTemplateRequest : WeChatWorkRequest
{
    /// <summary>
    /// id mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("template_id")]
    [JsonPropertyName("template_id")]
    public string TemplateId { get; set; }
    public WeChatWorkGetTemplateRequest(string templateId)
    {
        TemplateId = templateId;
    }
}
