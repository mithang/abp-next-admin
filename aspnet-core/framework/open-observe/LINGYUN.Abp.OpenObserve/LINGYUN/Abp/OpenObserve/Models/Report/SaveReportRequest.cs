using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Yêu cầu tạo/cập nhật báo cáo
/// </summary>
public class SaveReportRequest
{
    /// <summary>
    /// Tên báo cáo (duy nhất trong tổ chức)
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    /// <summary>
    /// Tiêu đề hiển thị
    /// </summary>
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    /// <summary>
    /// Tên tổ chức (bắt buộc)
    /// </summary>
    [JsonPropertyName("org_id")]
    public string Organization { get; set; } = default!;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    /// <summary>
    /// Nội dung email của báo cáo
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("enabled")]
    public bool Enabled { get; set; }

    [JsonPropertyName("frequency")]
    public ReportFrequency? Frequency { get; set; }

    /// <summary>
    /// Thời gian bắt đầu tạo (microgiây)
    /// </summary>
    [JsonPropertyName("start")]
    public long? Start { get; set; }

    /// <summary>
    /// Tên múi giờ
    /// </summary>
    [JsonPropertyName("timezone")]
    public string? Timezone { get; set; }

    /// <summary>
    /// Độ lệch múi giờ cố định (phút)
    /// </summary>
    [JsonPropertyName("timezoneOffset")]
    public int? TimezoneOffset { get; set; }

    /// <summary>
    /// Bảng điều khiển liên quan (bắt buộc)
    /// </summary>
    [JsonPropertyName("dashboards")]
    public ReportDashboardReference[] Dashboards { get; set; } = [];

    /// <summary>
    /// Đích gửi (bắt buộc)
    /// </summary>
    [JsonPropertyName("destinations")]
    public ReportDestination[] Destinations { get; set; } = [];
}
