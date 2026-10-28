using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển văn bản
/// </summary>
public class TextControlValue : ControlValue
{
    /// <summary>
    /// Nội dung văn bản, điền giá trị nhập của điều khiển văn bản/văn bản nhiều dòng tại đây. Nội dung Text của điều khiển văn bản không hỗ trợ chứa ký tự xuống dòng.
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = default!;
    public TextControlValue()
    {

    }

    public TextControlValue(string text)
    {
        Text = text;
    }
}
