using LINGYUN.Abp.OpenObserve.Models.Dashboard;
using LINGYUN.Abp.OpenObserve.Utils;
using System;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Thêm panel mới cho bảng điều khiển
    /// </summary>
    /// <remarks>
    /// POST /api/{org_id}/dashboards/{dashboard_id}/panels
    /// Chỉ hỗ trợ bảng điều khiển v8; hash là tham số bắt buộc, khi không khớp sẽ trả về 409
    /// Tham khảo: https://openobserve.ai/docs/reference/api/dashboard/
    /// </remarks>
    /// <param name="panel">Định nghĩa panel (đối tượng panel v8), khi thêm mới có thể bỏ qua layout để phía máy chủ tự tính</param>
    /// <param name="hash">Hash hiện tại của bảng điều khiển</param>
    /// <param name="tabId">Định danh tab, mặc định là tab đầu tiên</param>
    /// <param name="folder">Thư mục chứa bảng điều khiển, thư mục mặc định</param>
    public async virtual Task<DashboardPanelResponse> AddDashboardPanelAsync(
        string dashboardId,
        string hash,
        JsonNode panel,
        string? tabId = null,
        string? folder = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("hash", hash),
            ("folder", folder));

        var requestUri = $"/api/{ResolveOrganization(organization)}/dashboards/{Uri.EscapeDataString(dashboardId)}/panels{queryString}";

        var request = new SaveDashboardPanelRequest
        {
            Panel = panel,
            TabId = tabId,
        };

        return (await PostJsonAsync<SaveDashboardPanelRequest, DashboardPanelResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Cập nhật panel của bảng điều khiển
    /// </summary>
    /// <remarks>
    /// PUT /api/{org_id}/dashboards/{dashboard_id}/panels/{panel_id}
    /// Lấy panel_id trong đường dẫn làm chuẩn; khi panel bỏ qua layout thì giữ nguyên bố cục cũ
    /// Tham khảo: https://openobserve.ai/docs/reference/api/dashboard/
    /// </remarks>
    /// <param name="panel">Định nghĩa panel (đối tượng panel v8)</param>
    /// <param name="hash">Hash hiện tại của bảng điều khiển</param>
    /// <param name="tabId">Định danh tab, mặc định là tab đầu tiên</param>
    /// <param name="folder">Thư mục chứa bảng điều khiển, thư mục mặc định</param>
    public async virtual Task<DashboardPanelResponse> UpdateDashboardPanelAsync(
        string dashboardId,
        string panelId,
        string hash,
        JsonNode panel,
        string? tabId = null,
        string? folder = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("hash", hash),
            ("folder", folder));

        var requestUri = $"/api/{ResolveOrganization(organization)}/dashboards/{Uri.EscapeDataString(dashboardId)}/panels/{Uri.EscapeDataString(panelId)}{queryString}";

        var request = new SaveDashboardPanelRequest
        {
            Panel = panel,
            TabId = tabId,
        };

        return (await PutJsonAsync<SaveDashboardPanelRequest, DashboardPanelResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa panel của bảng điều khiển
    /// </summary>
    /// <remarks>
    /// DELETE /api/{org_id}/dashboards/{dashboard_id}/panels/{panel_id}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/dashboard/
    /// </remarks>
    /// <param name="hash">Hash hiện tại của bảng điều khiển</param>
    /// <param name="tabId">Tab được chỉ định, nếu bỏ qua sẽ tìm trong tất cả các tab</param>
    /// <param name="folder">Thư mục chứa bảng điều khiển, thư mục mặc định</param>
    public async virtual Task<DeleteDashboardPanelResponse> DeleteDashboardPanelAsync(
        string dashboardId,
        string panelId,
        string hash,
        string? tabId = null,
        string? folder = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("hash", hash),
            ("tabId", tabId),
            ("folder", folder));

        var requestUri = $"/api/{ResolveOrganization(organization)}/dashboards/{Uri.EscapeDataString(dashboardId)}/panels/{Uri.EscapeDataString(panelId)}{queryString}";

        return (await DeleteAsync<DeleteDashboardPanelResponse>(requestUri, cancellationToken: cancellationToken))!;
    }
}
