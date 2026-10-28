using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
/// <summary>
/// Tham số yêu cầu cập nhật mẫu phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97438"/>
/// </remarks>
public class WeChatWorkUpdateTemplateRequest
{
    /// <summary>
    /// Id mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("template_id")]
    [JsonPropertyName("template_id")]
    public string TemplateId { get; set; }
    /// <summary>
    /// Mảng tên mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("template_name")]
    [JsonPropertyName("template_name")]
    public List<TemplateName> TemplateName { get; set; }
    /// <summary>
    /// Cài đặt điều khiển mẫu phê duyệt, gồm nhiều điều khiển biểu mẫu và nội dung của chúng, trong đó có thông tin cần gán giá trị cho điều khiển
    /// </summary>
    [NotNull]
    [JsonProperty("template_content")]
    [JsonPropertyName("template_content")]
    public TemplateContent TemplateContent { get; set; }

    public WeChatWorkUpdateTemplateRequest(
        string templateId,
        List<TemplateName> templateName, 
        TemplateContent templateContent)
    {
        TemplateId = templateId;
        TemplateName = templateName;
        TemplateContent = templateContent;
    }
}
