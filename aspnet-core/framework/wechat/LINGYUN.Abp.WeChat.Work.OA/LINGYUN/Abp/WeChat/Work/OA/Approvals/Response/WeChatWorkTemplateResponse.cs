using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Response;
/// <summary>
/// Tham số phản hồi mẫu phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/91982"/>
/// </remarks>
public class WeChatWorkTemplateResponse : WeChatWorkResponse
{
    /// <summary>
    /// Mảng tên mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("template_names")]
    [JsonPropertyName("template_names")]
    public List<TemplateName> TemplateNames { get; set; } = default!;
    /// <summary>
    /// Thiết lập điều khiển mẫu phê duyệt, gồm nhiều điều khiển biểu mẫu và nội dung của chúng, trong đó chứa thông tin cần gán giá trị cho điều khiển
    /// </summary>
    [NotNull]
    [JsonProperty("template_content")]
    [JsonPropertyName("template_content")]
    public TemplateContent TemplateContent { get; set; } = default!;
    public WeChatWorkTemplateResponse()
    {

    }

    public WeChatWorkTemplateResponse(List<TemplateName> templateNames, TemplateContent templateContent)
    {
        TemplateNames = templateNames;
        TemplateContent = templateContent;
    }
}
