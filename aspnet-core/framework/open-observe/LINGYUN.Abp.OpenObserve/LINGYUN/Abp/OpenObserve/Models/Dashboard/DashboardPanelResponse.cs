using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Dashboard;

/// <summary>
/// Phản hồi thao tác trên bảng điều khiển (dashboard)
/// </summary>
public class DashboardPanelResponse
{
    /// <summary>
    /// Định nghĩa bảng (bao gồm id và layout do máy chủ tạo)
    /// </summary>
    [JsonPropertyName("panel")]
    public JsonNode? Panel { get; set; }

    /// <summary>
    /// Mã băm (hash) mới của bảng điều khiển
    /// </summary>
    /// <remarks>
    /// Yêu cầu tiếp theo dùng cho thao tác liên hoàn
    /// </remarks>
    [JsonPropertyName("hash")]
    public string? Hash { get; set; }

    /// <summary>
    /// Định danh tab
    /// </summary>
    [JsonPropertyName("tabId")]
    public string? TabId { get; set; }
}
