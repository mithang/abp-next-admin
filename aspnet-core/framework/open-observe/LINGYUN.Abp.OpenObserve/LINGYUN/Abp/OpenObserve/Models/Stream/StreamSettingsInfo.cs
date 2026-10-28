using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Cài đặt luồng dữ liệu (phản hồi)
/// </summary>
public class StreamSettingsInfo
{
    /// <summary>
    /// Trường phân vùng
    /// </summary>
    [JsonPropertyName("partition_keys")]
    public Dictionary<string, object?>? PartitionKeys { get; set; }

    /// <summary>
    /// Trường tìm kiếm toàn văn
    /// </summary>
    [JsonPropertyName("full_text_search_keys")]
    public string[]? FullTextSearchKeys { get; set; }
}
