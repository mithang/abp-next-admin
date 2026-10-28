using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Khoảng thời gian của báo cáo
/// </summary>
public class ReportTimeRange
{
    /// <summary>
    /// Loại
    /// </summary>
    /// <remarks>
    /// Ví dụ: relative
    /// </remarks>
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    /// <summary>
    /// Chu kỳ
    /// </summary>
    /// <remarks>
    /// Ví dụ: 1w
    /// </remarks>
    [JsonPropertyName("period")]
    public string? Period { get; set; }

    [JsonPropertyName("from")]
    public long From { get; set; }

    [JsonPropertyName("to")]
    public long To { get; set; }
}
