using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Cluster;

/// <summary>
/// Phản hồi thông tin cụm
/// </summary>
/// <remarks>
/// Cấu trúc phản hồi: {"regions":{"openobserve":{"zo1":{"pending_jobs":0}}}}
/// </remarks>
public class ClusterInfoResponse
{
    /// <summary>
    /// Thông tin cụm được tổ chức theo vùng và nút
    /// </summary>
    [JsonPropertyName("regions")]
    public Dictionary<string, Dictionary<string, ClusterNodeInfo>> Regions { get; set; } = [];

    /// <summary>
    /// Các trường chưa được khai báo trong mô hình
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? ExtraProperties { get; set; }
}
