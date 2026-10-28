using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Phản hồi bật/tắt báo cáo
/// </summary>
public class EnableReportResponse
{
    [JsonPropertyName("enabled")]
    public bool Enabled { get; set; }
}
