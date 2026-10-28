using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình điều khiển chi tiết
/// </summary>
public class TableControlConfig : ControlConfig
{
    /// <summary>
    /// Điều khiển chi tiết
    /// </summary>
    [NotNull]
    [JsonProperty("table")]
    [JsonPropertyName("table")]
    public TableConfig Table { get; set; } = default!;
    public TableControlConfig()
    {

    }

    public TableControlConfig(TableConfig table)
    {
        Table = table;
    }
}

public class TableConfig
{
    /// <summary>
    /// Định dạng in; 0-In gộp thành một dòng, 1-In tách thành nhiều dòng
    /// </summary>
    [NotNull]
    [JsonProperty("print_format")]
    [JsonPropertyName("print_format")]
    public byte PrintFormat { get; set; }
    /// <summary>
    /// Nội dung chi tiết, một điều khiển chi tiết có thể chứa nhiều điều khiển con, thuộc tính của mỗi điều khiển con giống với điều khiển
    /// </summary>
    [NotNull]
    [JsonProperty("children")]
    [JsonPropertyName("children")]
    public List<Control> Children { get; set; } = default!;
    public TableConfig()
    {

    }

    public TableConfig(byte printFormat, List<Control> children)
    {
        PrintFormat = printFormat;
        Children = children;
    }
}