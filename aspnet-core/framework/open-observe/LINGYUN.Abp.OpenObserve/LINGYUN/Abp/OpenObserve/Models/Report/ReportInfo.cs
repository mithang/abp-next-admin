using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Report;

/// <summary>
/// Thông tin báo cáo
/// </summary>
public class ReportInfo
{
    /// <summary>
    /// Định danh báo cáo (KSUID)
    /// </summary>
    [JsonPropertyName("report_id")]
    public string? ReportId { get; set; }

    /// <summary>
    /// Tên báo cáo
    /// </summary>
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Tiêu đề hiển thị
    /// </summary>
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    /// <summary>
    /// Thư mục sở hữu
    /// </summary>
    [JsonPropertyName("folder_id")]
    public string? FolderId { get; set; }

    /// <summary>
    /// Bảng điều khiển liên kết
    /// </summary>
    /// <remarks>
    /// Giao diện danh sách trả về mảng chuỗi, giao diện tạo/cập nhật trả về mảng đối tượng, vì vậy dùng JSON tự do
    /// </remarks>
    [JsonPropertyName("dashboards")]
    public JsonNode? Dashboards { get; set; }

    /// <summary>
    /// Tần suất lập lịch
    /// </summary>
    [JsonPropertyName("frequency")]
    public ReportFrequency? Frequency { get; set; }

    /// <summary>
    /// Có bật hay không
    /// </summary>
    [JsonPropertyName("enabled")]
    public bool Enabled { get; set; }

    /// <summary>
    /// Chủ sở hữu
    /// </summary>
    [JsonPropertyName("owner")]
    public string? Owner { get; set; }

    /// <summary>
    /// Thời gian kích hoạt lần cuối (micro giây)
    /// </summary>
    [JsonPropertyName("last_triggered_at")]
    public long? LastTriggeredAt { get; set; }

    /// <summary>
    /// Các trường không được khai báo trong mô hình
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? ExtraProperties { get; set; }
}
