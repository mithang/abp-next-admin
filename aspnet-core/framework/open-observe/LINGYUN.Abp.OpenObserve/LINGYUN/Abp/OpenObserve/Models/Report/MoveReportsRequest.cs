using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Yêu cầu di chuyển báo cáo
/// </summary>
public class MoveReportsRequest
{
    /// <summary>
    /// Tập hợp định danh báo cáo
    /// </summary>
    [JsonPropertyName("report_ids")]
    public string[] ReportIds { get; set; } = [];

    /// <summary>
    /// Thư mục đích
    /// </summary>
    [JsonPropertyName("dst_folder_id")]
    public string DestinationFolderId { get; set; } = default!;
}
