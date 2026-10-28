using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Dashboard;

/// <summary>
/// Phản hồi xóa panel dashboard
/// </summary>
public class DeleteDashboardPanelResponse
{
    /// <summary>
    /// Hash mới của dashboard
    /// </summary>
    [JsonPropertyName("hash")]
    public string? Hash { get; set; }

    /// <summary>
    /// Định danh của panel đã xóa
    /// </summary>
    [JsonPropertyName("panelId")]
    public string? PanelId { get; set; }
}
