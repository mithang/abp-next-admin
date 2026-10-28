using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Yêu cầu xóa hàng loạt báo cáo
/// </summary>
public class BulkDeleteReportsRequest
{
    [JsonPropertyName("ids")]
    public string[] Ids { get; set; } = [];
}
