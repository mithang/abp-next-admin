using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Tần suất lập lịch
/// </summary>
public class ReportFrequency
{
    /// <summary>
    /// Loại tần suất
    /// </summary>
    /// <remarks>
    /// once / hours / days / weeks / months / cron
    /// </remarks>
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    /// <summary>
    /// Khoảng thời gian
    /// </summary>
    [JsonPropertyName("interval")]
    public int? Interval { get; set; }

    /// <summary>
    /// Biểu thức cron
    /// </summary>
    [JsonPropertyName("cron")]
    public string? Cron { get; set; }

    /// <summary>
    /// Có căn chỉnh thời gian hay không
    /// </summary>
    [JsonPropertyName("align_time")]
    public bool? AlignTime { get; set; }
}
