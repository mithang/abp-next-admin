using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Phản hồi xóa hàng loạt
/// </summary>
public class BulkDeleteReportsResponse
{
    [JsonPropertyName("successful")]
    public string[] Successful { get; set; } = [];

    [JsonPropertyName("unsuccessful")]
    public string[] Unsuccessful { get; set; } = [];

    /// <summary>
    /// Thông tin lỗi
    /// </summary>
    [JsonPropertyName("err")]
    public string? Error { get; set; }
}
