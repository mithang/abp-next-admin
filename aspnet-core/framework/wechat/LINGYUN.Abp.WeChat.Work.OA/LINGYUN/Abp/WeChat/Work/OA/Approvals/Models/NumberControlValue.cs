using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển số
/// </summary>
public class NumberControlValue : ControlValue
{
    /// <summary>
    /// Nội dung số, điền giá trị nhập của điều khiển số tại đây
    /// </summary>
    [NotNull]
    [JsonProperty("new_number")]
    [JsonPropertyName("new_number")]
    public string NewMumber { get; set; } = default!;
    public NumberControlValue()
    {

    }

    public NumberControlValue(decimal newMumber)
    {
        NewMumber = newMumber.ToString();
    }
}
