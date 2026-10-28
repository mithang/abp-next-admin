using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Định nghĩa điều khiển mẫu
/// </summary>
public class TemplateContent
{
    /// <summary>
    /// Mảng điều khiển, trong mẫu có thể đặt nhiều loại điều khiển, thứ tự sắp xếp giống với hiển thị ở phía quản trị
    /// </summary>
    [NotNull]
    [JsonProperty("controls")]
    [JsonPropertyName("controls")]
    public List<Control> Controls { get; set; } = default!;
}
