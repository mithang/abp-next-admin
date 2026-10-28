using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Dashboard liên kết với báo cáo
/// </summary>
public class ReportDashboardReference
{
    /// <summary>
    /// Mã định danh dashboard
    /// </summary>
    [JsonPropertyName("dashboard")]
    public string Dashboard { get; set; } = default!;

    /// <summary>
    /// Thư mục chứa dashboard
    /// </summary>
    [JsonPropertyName("folder")]
    public string? Folder { get; set; }

    /// <summary>
    /// Tab
    /// </summary>
    [JsonPropertyName("tabs")]
    public string[]? Tabs { get; set; }

    /// <summary>
    /// Biến
    /// </summary>
    [JsonPropertyName("variables")]
    public JsonNode? Variables { get; set; }

    /// <summary>
    /// Phạm vi thời gian
    /// </summary>
    [JsonPropertyName("timerange")]
    public ReportTimeRange? TimeRange { get; set; }
}
