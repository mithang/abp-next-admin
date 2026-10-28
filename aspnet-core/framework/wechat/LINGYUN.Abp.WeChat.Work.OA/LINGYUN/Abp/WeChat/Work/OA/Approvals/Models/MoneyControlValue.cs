using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển số tiền
/// </summary>
public class MoneyControlValue : ControlValue
{
    /// <summary>
    /// Nội dung số tiền, điền giá trị nhập của điều khiển số tiền tại đây
    /// </summary>
    [NotNull]
    [JsonProperty("new_money")]
    [JsonPropertyName("new_money")]
    public string NewMoney { get; set; } = default!;
    public MoneyControlValue()
    {

    }

    public MoneyControlValue(decimal newMoney)
    {
        NewMoney = newMoney.ToString();
    }
}
