using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Phản hồi xóa dữ liệu theo khoảng thời gian
/// </summary>
public class StreamDeleteJobResponse
{
    /// <summary>
    /// Định danh nhiệm vụ xóa
    /// </summary>
    /// <remarks>
    /// Dùng để truy vấn tiến độ xóa
    /// </remarks>
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;
}
