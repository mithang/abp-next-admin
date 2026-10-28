using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Trạng thái tác vụ xóa dữ liệu theo phạm vi thời gian
/// </summary>
public class StreamDeleteJobStatusResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;

    /// <summary>
    /// Trạng thái tác vụ
    /// </summary>
    /// <remarks>
    /// Completed / Pending
    /// </remarks>
    [JsonPropertyName("status")]
    public string Status { get; set; } = default!;

    /// <summary>
    /// Chi tiết thực thi của từng cụm/vùng
    /// </summary>
    [JsonPropertyName("metadata")]
    public StreamDeleteJobMetadata[]? Metadata { get; set; }

    /// <summary>
    /// Lỗi thực thi
    /// </summary>
    [JsonPropertyName("errors")]
    public StreamDeleteJobError[]? Errors { get; set; }
}
