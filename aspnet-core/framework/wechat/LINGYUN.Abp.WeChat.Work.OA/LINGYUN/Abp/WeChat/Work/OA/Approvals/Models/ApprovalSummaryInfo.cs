using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Thông tin tóm tắt
/// </summary>
public class ApprovalSummaryInfo
{
    /// <summary>
    /// Văn bản hiển thị của dòng tóm tắt, dùng để hiển thị danh sách ghi chép và thông báo tin nhắn, không vượt quá 20 ký tự
    /// </summary>
    [NotNull]
    [StringLength(20)]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = default!;
    /// <summary>
    /// Ngôn ngữ hiển thị của dòng tóm tắt, tiếng Trung: zh_CN (lưu ý không phải zh-CN), tiếng Anh: en.
    /// </summary>
    [NotNull]
    [StringLength(30)]
    [JsonProperty("lang")]
    [JsonPropertyName("lang")]
    public string Lang { get; set; } = default!;
    public ApprovalSummaryInfo()
    {

    }

    public ApprovalSummaryInfo(string text, string lang = "zh_CN")
    {
        Text = text;
        Lang = lang;
    }
}
