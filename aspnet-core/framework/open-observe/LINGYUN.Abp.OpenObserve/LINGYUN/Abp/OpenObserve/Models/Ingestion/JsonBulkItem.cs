using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Ingestion;

/// <summary>
/// Kết quả xử lý của từng bản ghi _bulk
/// </summary>
public class JsonBulkItem
{
    [JsonPropertyName("_index")]
    public string? Index { get; set; }

    [JsonPropertyName("_id")]
    public string? Id { get; set; }

    /// <summary>
    /// Phiên bản
    /// </summary>
    /// <remarks>
    /// Giá trị giữ chỗ tương thích với Elasticsearch, không đại diện cho phiên bản thực
    /// </remarks>
    [JsonPropertyName("_version")]
    public int Version { get; set; }

    /// <summary>
    /// Kết quả xử lý
    /// </summary>
    /// <remarks>
    /// Ví dụ: created
    /// </remarks>
    [JsonPropertyName("result")]
    public string? Result { get; set; }

    /// <summary>
    /// Mã trạng thái
    /// </summary>
    /// <remarks>
    /// 200 nghĩa là thành công, >=400 nghĩa là thất bại
    /// </remarks>
    [JsonPropertyName("status")]
    public int Status { get; set; }

    /// <summary>
    /// Thông tin lỗi
    /// </summary>
    [JsonPropertyName("error")]
    public JsonBulkItemError? Error { get; set; }

    /// <summary>
    /// Bản ghi gốc
    /// </summary>
    /// <remarks>
    /// Chỉ trả về khi thất bại
    /// </remarks>
    [JsonPropertyName("originalRecord")]
    public JsonElement? OriginalRecord { get; set; }

    /// <summary>
    /// Có thành công hay không
    /// </summary>
    [JsonIgnore]
    public bool IsSuccess => Status is >= 200 and < 300;
}
