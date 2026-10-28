using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển chọn đơn/chọn nhiều
/// </summary>
public class SelectorControlValue : ControlValue
{
    /// <summary>
    /// Nội dung chọn đơn/chọn nhiều
    /// </summary>
    [NotNull]
    [JsonProperty("selector")]
    [JsonPropertyName("selector")]
    public SelectorValue Selector { get; set; } = default!;
    public SelectorControlValue()
    {

    }

    public SelectorControlValue(SelectorValue selector)
    {
        Selector = selector;
    }
}

public class SelectorValue
{
    /// <summary>
    /// Phương thức chọn: single - chọn đơn; multi - chọn nhiều
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// Tùy chọn chọn nhiều; điều khiển chọn có thuộc tính chọn nhiều cho phép nhập nhiều giá trị
    /// </summary>
    [NotNull]
    [JsonProperty("options")]
    [JsonPropertyName("options")]
    public List<SelectorValueOption> Options { get; set; } = default!;
    public SelectorValue()
    {

    }

    private SelectorValue(string type, List<SelectorValueOption> options)
    {
        Type = type;
        Options = options;
    }
    /// <summary>
    /// Tạo một tùy chọn chọn đơn
    /// </summary>
    /// <param name="option"></param>
    /// <returns></returns>
    public static SelectorValue Single(SelectorValueOption option)
    {
        return new SelectorValue("single", new List<SelectorValueOption> { option });
    }

    /// <summary>
    /// Tạo một tùy chọn chọn nhiều
    /// </summary>
    /// <param name="options"></param>
    /// <returns></returns>
    public static SelectorValue Multiple(List<SelectorValueOption> options)
    {
        return new SelectorValue("multi", options);
    }
}

public class SelectorValueOption
{
    /// <summary>
    /// Khóa tùy chọn, có thể lấy qua giao diện “lấy chi tiết mẫu phê duyệt”
    /// </summary>
    [NotNull]
    [JsonProperty("key")]
    [JsonPropertyName("key")]
    public string Key { get; set; } = default!;
    /// <summary>
    /// Giá trị tùy chọn; nếu đã cấu hình đa ngôn ngữ thì sẽ bao gồm giá trị tùy chọn tiếng Trung và tiếng Anh
    /// </summary>
    [NotNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public List<SelectorValueOptionValue> Value { get; set; } = default!;
    public SelectorValueOption()
    {

    }

    public SelectorValueOption(string key, List<SelectorValueOptionValue> value)
    {
        Key = key;
        Value = value;
    }
}

public class SelectorValueOptionValue
{
    /// <summary>
    /// Giá trị tùy chọn
    /// </summary>
    [NotNull]
    [StringLength(40)]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = default!;
    /// <summary>
    /// Tên đa ngôn ngữ
    /// </summary>
    [NotNull]
    [JsonProperty("lang")]
    [JsonPropertyName("lang")]
    public string Lang { get; set; } = default!;
    public SelectorValueOptionValue()
    {

    }

    public SelectorValueOptionValue(string text, string lang = "zh_CN")
    {
        Text = text;
        Lang = lang;
    }
}