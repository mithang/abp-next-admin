using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Thông tin thống kê luồng dữ liệu
/// </summary>
public class StreamStats
{
    /// <summary>
    /// Thời gian tạo luồng dữ liệu (microgiây)
    /// </summary>
    [JsonPropertyName("created_at")]
    public long CreatedAt { get; set; }

    /// <summary>
    /// Dấu thời gian nhỏ nhất của bản ghi (microgiây)
    /// </summary>
    [JsonPropertyName("doc_time_min")]
    public long DocTimeMin { get; set; }

    /// <summary>
    /// Dấu thời gian lớn nhất của bản ghi (microgiây)
    /// </summary>
    [JsonPropertyName("doc_time_max")]
    public long DocTimeMax { get; set; }

    /// <summary>
    /// Số lượng bản ghi
    /// </summary>
    [JsonPropertyName("doc_num")]
    public long DocNum { get; set; }

    /// <summary>
    /// Số lượng tệp lưu trữ
    /// </summary>
    [JsonPropertyName("file_num")]
    public long FileNum { get; set; }

    /// <summary>
    /// Kích thước dữ liệu gốc
    /// </summary>
    /// <remarks>
    /// Bảng trường tài liệu ghi là int64, nhưng ví dụ phản hồi là số thập phân (3323.5), do đó dùng double
    /// </remarks>
    [JsonPropertyName("storage_size")]
    public double StorageSize { get; set; }

    /// <summary>
    /// Kích thước sau khi nén
    /// </summary>
    [JsonPropertyName("compressed_size")]
    public double CompressedSize { get; set; }

    /// <summary>
    /// Kích thước chỉ mục
    /// </summary>
    [JsonPropertyName("index_size")]
    public double IndexSize { get; set; }
}
