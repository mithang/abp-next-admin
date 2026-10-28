using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Chi tiết thực thi tác vụ xóa
/// </summary>
public class StreamDeleteJobMetadata
{
    [JsonPropertyName("cluster")]
    public string? Cluster { get; set; }

    [JsonPropertyName("region")]
    public string? Region { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("key")]
    public string? Key { get; set; }

    /// <summary>
    /// Thời gian tạo (micro giây)
    /// </summary>
    [JsonPropertyName("created_at")]
    public long CreatedAt { get; set; }

    /// <summary>
    /// Thời gian kết thúc (micro giây), 0 nghĩa là vẫn đang chạy
    /// </summary>
    [JsonPropertyName("ended_at")]
    public long EndedAt { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }
}
