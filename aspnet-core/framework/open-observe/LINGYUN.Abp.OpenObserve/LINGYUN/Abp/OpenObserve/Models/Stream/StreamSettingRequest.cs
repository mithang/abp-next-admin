using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Stream;

/// <summary>
/// Yêu cầu tạo cài đặt luồng dữ liệu
/// </summary>
/// <remarks>
/// POST /api/{org_id}/streams/{stream_name}/settings, tất cả các trường đều tùy chọn
/// </remarks>
public class StreamSettingRequest
{
    /// <summary>
    /// Trường phân vùng
    /// </summary>
    [JsonPropertyName("partition_keys")]
    public string[]? PartitionKeys { get; set; }

    /// <summary>
    /// Trường chỉ mục cấp hai
    /// </summary>
    [JsonPropertyName("index_fields")]
    public string[]? IndexFields { get; set; }

    /// <summary>
    /// Trường tìm kiếm toàn văn
    /// </summary>
    [JsonPropertyName("full_text_search_keys")]
    public string[]? FullTextSearchKeys { get; set; }

    /// <summary>
    /// Trường bộ lọc Bloom
    /// </summary>
    [JsonPropertyName("bloom_filter_fields")]
    public string[]? BloomFilterFields { get; set; }

    /// <summary>
    /// Số ngày lưu giữ dữ liệu
    /// </summary>
    /// <remarks>
    /// Tối thiểu 3 ngày, luồng compliance tối thiểu 30 ngày
    /// </remarks>
    [JsonPropertyName("data_retention")]
    public int? DataRetention { get; set; }

    /// <summary>
    /// Cấp độ làm phẳng
    /// </summary>
    [JsonPropertyName("flatten_level")]
    public int? FlattenLevel { get; set; }

    /// <summary>
    /// Các trường schema tùy chỉnh được giữ lại
    /// </summary>
    [JsonPropertyName("defined_schema_fields")]
    public string[]? DefinedSchemaFields { get; set; }

    /// <summary>
    /// Phạm vi thời gian tối đa cho một lần truy vấn (giờ)
    /// </summary>
    [JsonPropertyName("max_query_range")]
    public int? MaxQueryRange { get; set; }

    /// <summary>
    /// Có lưu trữ dữ liệu gốc hay không
    /// </summary>
    [JsonPropertyName("store_original_data")]
    public bool? StoreOriginalData { get; set; }

    /// <summary>
    /// Có sử dụng phân vùng theo phạm vi thời gian chia đều hay không
    /// </summary>
    [JsonPropertyName("approx_partition")]
    public bool? ApproxPartition { get; set; }

    /// <summary>
    /// Phạm vi thời gian kéo dài thời hạn lưu giữ
    /// </summary>
    /// <remarks>
    /// Tài liệu chưa mô tả cấu trúc cụ thể của phần tử
    /// </remarks>
    [JsonPropertyName("extended_retention_days")]
    public object[]? ExtendedRetentionDays { get; set; }

    /// <summary>
    /// Có lập chỉ mục toàn văn cho thân log gốc hay không
    /// </summary>
    [JsonPropertyName("index_original_data")]
    public bool? IndexOriginalData { get; set; }

    /// <summary>
    /// Có lập chỉ mục khớp chính xác cho tất cả các trường hay không
    /// </summary>
    [JsonPropertyName("index_all_values")]
    public bool? IndexAllValues { get; set; }

    /// <summary>
    /// Loại lưu trữ
    /// </summary>
    /// <remarks>
    /// normal (mặc định) / compliance
    /// </remarks>
    [JsonPropertyName("storage_type")]
    public string? StorageType { get; set; }
}
