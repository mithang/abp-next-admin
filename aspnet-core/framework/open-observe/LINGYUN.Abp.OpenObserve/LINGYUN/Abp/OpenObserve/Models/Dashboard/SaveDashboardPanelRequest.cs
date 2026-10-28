using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Dashboard;

/// <summary>
/// Yêu cầu thêm mới/cập nhật panel của dashboard
/// </summary>
/// <remarks>
/// panel là đối tượng panel v8, tài liệu chưa đưa ra schema đầy đủ nên sử dụng JSON tự do
/// Khi thêm mới có thể bỏ qua layout (tự động tính toán); khi cập nhật, bỏ qua layout nghĩa là giữ nguyên bố cục gốc
/// </remarks>
public class SaveDashboardPanelRequest
{
    /// <summary>
    /// Định nghĩa panel
    /// </summary>
    [JsonPropertyName("panel")]
    public JsonNode? Panel { get; set; }

    /// <summary>
    /// Mã định danh tab
    /// </summary>
    /// <remarks>
    /// Tab đầu tiên theo mặc định
    /// </remarks>
    [JsonPropertyName("tabId")]
    public string? TabId { get; set; }
}
