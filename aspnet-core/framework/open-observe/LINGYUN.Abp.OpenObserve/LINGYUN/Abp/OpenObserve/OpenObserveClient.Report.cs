using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Report;
using LINGYUN.Abp.OpenObserve.Utils;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

/// <summary>
/// Giao diện báo cáo
/// </summary>
/// <remarks>
/// Giao diện báo cáo dùng tiền tố /api/v2
/// Tham khảo: https://openobserve.ai/docs/reference/api/report/
/// </remarks>
public partial class OpenObserveClient
{
    /// <summary>
    /// Liệt kê báo cáo
    /// </summary>
    /// <remarks>
    /// GET /api/v2/{org_id}/reports
    /// Phản hồi là mảng trần, không có đóng gói phân trang
    /// </remarks>
    /// <param name="folder">Lọc theo thư mục, khi bỏ qua sẽ trả về báo cáo của nhiều thư mục</param>
    /// <param name="dashboardId">Chỉ trả về báo cáo trỏ tới bảng điều khiển này</param>
    /// <param name="cache">Khi là true chỉ trả về báo cáo không có đích gửi (chỉ bộ nhớ đệm)</param>
    public async virtual Task<ReportInfo[]> GetReportsAsync(
        string? organization = null,
        string? folder = null,
        string? dashboardId = null,
        bool? cache = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("folder", folder),
            ("dashboard_id", dashboardId),
            ("cache", cache));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports{queryString}";

        return (await GetAsync<ReportInfo[]>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Tạo báo cáo
    /// </summary>
    /// <remarks>
    /// POST /api/v2/{org_id}/reports
    /// </remarks>
    /// <param name="name">Tên báo cáo (duy nhất trong tổ chức)</param>
    /// <param name="frequency">Tần suất lập lịch</param>
    /// <param name="dashboards">Bảng điều khiển liên kết (bắt buộc)</param>
    /// <param name="destinations">Đích gửi (bắt buộc)</param>
    /// <param name="startTime">Thời gian bắt đầu tạo, được chuyển đổi sang micro giây để gửi</param>
    /// <param name="folder">Thư mục đích, bắt buộc ở bản Enterprise</param>
    public async virtual Task<OpenObserveCodeMessageResponse> CreateReportAsync(
        string name,
        ReportFrequency frequency,
        ReportDashboardReference[] dashboards,
        ReportDestination[] destinations,
        string? title = null,
        string? description = null,
        string? message = null,
        bool enabled = true,
        DateTime? startTime = null,
        string? timezone = null,
        int? timezoneOffset = null,
        string? folder = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(("folder", folder));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports{queryString}";

        return (await PostJsonAsync<SaveReportRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            CreateReportRequest(name, frequency, dashboards, destinations, title, description,
                message, enabled, startTime, timezone, timezoneOffset, organization),
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Lấy báo cáo
    /// </summary>
    /// <remarks>
    /// GET /api/v2/{org_id}/reports/{report_id}
    /// </remarks>
    public async virtual Task<ReportInfo> GetReportAsync(
        string reportId,
        string? organization = null,
        string? folder = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(("folder", folder));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/{Uri.EscapeDataString(reportId)}{queryString}";

        return (await GetAsync<ReportInfo>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Cập nhật báo cáo
    /// </summary>
    /// <remarks>
    /// PUT /api/v2/{org_id}/reports/{report_id}
    /// Cần cung cấp đầy đủ nội dung báo cáo
    /// </remarks>
    /// <param name="folder">Khi truyền vào đồng thời di chuyển báo cáo tới thư mục đó</param>
    public async virtual Task<OpenObserveCodeMessageResponse> UpdateReportAsync(
        string reportId,
        string name,
        ReportFrequency frequency,
        ReportDashboardReference[] dashboards,
        ReportDestination[] destinations,
        string? title = null,
        string? description = null,
        string? message = null,
        bool enabled = true,
        DateTime? startTime = null,
        string? timezone = null,
        int? timezoneOffset = null,
        string? folder = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(("folder", folder));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/{Uri.EscapeDataString(reportId)}{queryString}";

        return (await PutJsonAsync<SaveReportRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            CreateReportRequest(name, frequency, dashboards, destinations, title, description,
                message, enabled, startTime, timezone, timezoneOffset, organization),
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa báo cáo
    /// </summary>
    /// <remarks>
    /// DELETE /api/v2/{org_id}/reports/{report_id}
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> DeleteReportAsync(
        string reportId,
        string? organization = null,
        string? folder = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(("folder", folder));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/{Uri.EscapeDataString(reportId)}{queryString}";

        return (await DeleteAsync<OpenObserveCodeMessageResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa hàng loạt báo cáo
    /// </summary>
    /// <remarks>
    /// DELETE /api/v2/{org_id}/reports/bulk
    /// Việc xóa có tính lũy đẳng, các định danh không tồn tại cũng sẽ được báo cáo là thành công
    /// </remarks>
    public async virtual Task<BulkDeleteReportsResponse> BulkDeleteReportsAsync(
        IEnumerable<string> ids,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/bulk";

        return (await SendJsonAsync<BulkDeleteReportsRequest, BulkDeleteReportsResponse>(
            HttpMethod.Delete,
            requestUri,
            new BulkDeleteReportsRequest { Ids = [.. ids] },
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Di chuyển báo cáo
    /// </summary>
    /// <remarks>
    /// PATCH /api/v2/{org_id}/reports/move
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> MoveReportsAsync(
        IEnumerable<string> reportIds,
        string destinationFolderId,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/move";

        return (await SendJsonAsync<MoveReportsRequest, OpenObserveCodeMessageResponse>(
            HttpMethod.Patch,
            requestUri,
            new MoveReportsRequest
            {
                ReportIds = [.. reportIds],
                DestinationFolderId = destinationFolderId,
            },
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Bật/tắt báo cáo
    /// </summary>
    /// <remarks>
    /// PATCH /api/v2/{org_id}/reports/{report_id}/enable?value=true
    /// </remarks>
    public async virtual Task<EnableReportResponse> EnableReportAsync(
        string reportId,
        bool value = true,
        string? organization = null,
        string? folder = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("folder", folder),
            ("value", value));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/{Uri.EscapeDataString(reportId)}/enable{queryString}";

        return (await SendJsonAsync<object, EnableReportResponse>(
            HttpMethod.Patch,
            requestUri,
            null,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Kích hoạt báo cáo thủ công
    /// </summary>
    /// <remarks>
    /// PUT /api/v2/{org_id}/reports/{report_id}/trigger
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> TriggerReportAsync(
        string reportId,
        string? organization = null,
        string? folder = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(("folder", folder));

        var requestUri = $"/api/v2/{ResolveOrganization(organization)}/reports/{Uri.EscapeDataString(reportId)}/trigger{queryString}";

        return (await SendJsonAsync<object, OpenObserveCodeMessageResponse>(
            HttpMethod.Put,
            requestUri,
            null,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Lắp ráp yêu cầu báo cáo
    /// </summary>
    protected virtual SaveReportRequest CreateReportRequest(
        string name,
        ReportFrequency frequency,
        ReportDashboardReference[] dashboards,
        ReportDestination[] destinations,
        string? title,
        string? description,
        string? message,
        bool enabled,
        DateTime? startTime,
        string? timezone,
        int? timezoneOffset,
        string? organization)
    {
        return new SaveReportRequest
        {
            Name = name,
            Title = title,
            Organization = ResolveOrganization(organization),
            Description = description,
            Message = message,
            Enabled = enabled,
            Frequency = frequency,
            Start = startTime?.ToMicroseconds(),
            Timezone = timezone,
            TimezoneOffset = timezoneOffset,
            Dashboards = dashboards,
            Destinations = destinations,
        };
    }
}
