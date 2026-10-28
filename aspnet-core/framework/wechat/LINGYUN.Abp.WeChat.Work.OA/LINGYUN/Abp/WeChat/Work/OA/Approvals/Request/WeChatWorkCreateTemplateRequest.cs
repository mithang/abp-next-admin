using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
/// <summary>
/// Tham số yêu cầu tạo mẫu phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/97437"/>
/// </remarks>
public class WeChatWorkCreateTemplateRequest : WeChatWorkRequest
{
    /// <summary>
    /// Mảng tên mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("template_name")]
    [JsonPropertyName("template_name")]
    public List<TemplateName> TemplateName {  get; set; }
    /// <summary>
    /// Thiết lập điều khiển mẫu phê duyệt, gồm nhiều điều khiển biểu mẫu và nội dung của chúng, trong đó chứa thông tin cần gán giá trị cho điều khiển
    /// </summary>
    [NotNull]
    [JsonProperty("template_content")]
    [JsonPropertyName("template_content")]
    public TemplateContent TemplateContent { get; set; }

    public WeChatWorkCreateTemplateRequest(List<TemplateName> templateName, TemplateContent templateContent)
    {
        TemplateName = templateName;
        TemplateContent = templateContent;
    }
}
