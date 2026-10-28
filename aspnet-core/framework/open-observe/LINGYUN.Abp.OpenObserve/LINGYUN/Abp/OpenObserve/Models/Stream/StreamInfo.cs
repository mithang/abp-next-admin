using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Thông tin luồng dữ liệu
/// </summary>
public class StreamInfo
{
    /// <summary>
    /// Tên luồng dữ liệu
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    /// <summary>
    /// Loại lưu trữ
    /// </summary>
    /// <remarks>
    /// s3 / disk
    /// </remarks>
    [JsonPropertyName("storage_type")]
    public string? StorageType { get; set; }

    /// <summary>
    /// Loại luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// logs / metrics / traces
    /// </remarks>
    [JsonPropertyName("stream_type")]
    public string? StreamType { get; set; }

    /// <summary>
    /// Thông tin thống kê
    /// </summary>
    [JsonPropertyName("stats")]
    public StreamStats? Stats { get; set; }

    /// <summary>
    /// Định nghĩa trường
    /// </summary>
    /// <remarks>
    /// Khi tham số truy vấn fetchSchema là false thì không trả về
    /// </remarks>
    [JsonPropertyName("schema")]
    public StreamSchemaField[]? Schema { get; set; }

    /// <summary>
    /// Cài đặt luồng dữ liệu
    /// </summary>
    [JsonPropertyName("settings")]
    public StreamSettingsInfo? Settings { get; set; }
}
