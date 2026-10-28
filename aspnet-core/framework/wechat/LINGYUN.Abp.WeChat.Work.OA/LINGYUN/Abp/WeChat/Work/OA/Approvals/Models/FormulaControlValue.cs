using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển công thức
/// </summary>
public class FormulaControlValue : ControlValue
{
    /// <summary>
    /// Công thức
    /// </summary>
    [NotNull]
    [JsonProperty("formula")]
    [JsonPropertyName("formula")]
    public FormulaValue Formula { get; set; } = default!;
    public FormulaControlValue()
    {

    }

    public FormulaControlValue(FormulaValue formula)
    {
        Formula = formula;
    }
}

public class FormulaValue
{
    /// <summary>
    /// Giá trị của công thức, khi gửi biểu mẫu không cần điền, hệ thống tự động tính toán
    /// </summary>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string Value { get; set; } = default!;
    public FormulaValue()
    {

    }

    public FormulaValue(string value)
    {
        Value = value;
    }
}