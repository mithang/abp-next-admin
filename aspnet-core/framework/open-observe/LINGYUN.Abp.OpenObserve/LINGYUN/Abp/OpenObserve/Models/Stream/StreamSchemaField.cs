using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Định nghĩa trường luồng dữ liệu
/// </summary>
public class StreamSchemaField
{
    /// <summary>
    /// Tên trường
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    /// <summary>
    /// Kiểu trường
    /// </summary>
    /// <remarks>
    /// Utf8 / Int64 / Float64 / Timestamp / Boolean
    /// </remarks>
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
}
