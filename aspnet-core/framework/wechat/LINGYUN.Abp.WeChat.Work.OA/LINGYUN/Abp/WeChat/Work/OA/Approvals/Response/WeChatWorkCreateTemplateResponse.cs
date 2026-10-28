using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Response;
/// <summary>
/// Tham số phản hồi tạo mẫu phê duyệt
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/97437"/>
/// </remarks>
public class WeChatWorkCreateTemplateResponse : WeChatWorkResponse
{
    /// <summary>
    /// Id mẫu được trả về sau khi tạo mẫu thành công
    /// </summary>
    [NotNull]
    [JsonProperty("template_id")]
    [JsonPropertyName("template_id")]
    public string TemplateId { get; set; } = default!;
}
