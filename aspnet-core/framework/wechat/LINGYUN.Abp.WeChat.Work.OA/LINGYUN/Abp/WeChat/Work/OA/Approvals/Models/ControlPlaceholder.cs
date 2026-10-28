using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Mô tả điều khiển
/// </summary>
public class ControlPlaceholder
{
    /// <summary>
    /// Mô tả điều khiển. Cần thỏa mãn điều kiện sau: độ dài không được vượt quá 80 ký tự.
    /// </summary>
    [NotNull]
    [StringLength(80)]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = default!;
    /// <summary>
    /// Ngôn ngữ hiển thị, tiếng Trung: zh_CN (lưu ý không phải zh-CN); nếu đã nhập text thì trường này là bắt buộc
    /// </summary>
    [NotNull]
    [JsonProperty("lang")]
    [JsonPropertyName("lang")]
    public string Lang { get; set; } = default!;
    public ControlPlaceholder()
    {

    }

    public ControlPlaceholder(string text, string lang = "zh_CN")
    {
        Text = text;
        Lang = lang;
    }
}
