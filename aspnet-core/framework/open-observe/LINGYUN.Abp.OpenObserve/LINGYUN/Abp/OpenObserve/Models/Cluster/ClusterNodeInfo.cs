using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Cluster;

/// <summary>
/// Thông tin nút cụm
/// </summary>
public class ClusterNodeInfo
{
    /// <summary>
    /// Số tác vụ nén đang chờ xử lý
    /// </summary>
    [JsonPropertyName("pending_jobs")]
    public int PendingJobs { get; set; }

    /// <summary>
    /// Các trường chưa được khai báo trong mô hình
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? ExtraProperties { get; set; }
}
