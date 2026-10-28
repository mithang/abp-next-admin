using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Tên điều khiển
/// </summary>
public class ControlTtile
{
    /// <summary>
    /// Tên điều khiển. Cần đáp ứng các điều kiện sau: 1 - Tên điều khiển không được trùng với tên điều khiển hiện có; 2 - Độ dài không được vượt quá 40 ký tự. 3 - title của điều khiển Attendance - ra ngoài/công tác/tăng ca cố định là ra ngoài/công tác/tăng ca, tạm thời chưa hỗ trợ tùy chỉnh
    /// </summary>
    [NotNull]
    [StringLength(40)]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = default!;
    /// <summary>
    /// Ngôn ngữ hiển thị, tiếng Trung: zh_CN (lưu ý không phải zh-CN)
    /// </summary>
    [NotNull]
    [JsonProperty("lang")]
    [JsonPropertyName("lang")]
    public string Lang { get; set; } = default!;
    public ControlTtile()
    {

    }

    public ControlTtile(string text, string lang = "zh_CN")
    {
        Text = text;
        Lang = lang;
    }
}
