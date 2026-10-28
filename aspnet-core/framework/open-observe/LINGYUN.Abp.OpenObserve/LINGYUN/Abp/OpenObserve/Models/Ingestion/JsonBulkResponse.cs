using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Ingestion;

/// <summary>
/// Phản hồi _bulk
/// </summary>
/// <remarks>
/// Cấu trúc tương thích _bulk của Elasticsearch
/// {"took":0,"errors":false,"items":[{"index":{"_index":"stream1","_id":"..","status":200,"result":"created"}}]}
/// </remarks>
public class JsonBulkResponse
{
    /// <summary>
    /// Thời gian tốn
    /// </summary>
    /// <remarks>
    /// OpenObserve luôn trả về 0, không điền thời gian tốn thực tế
    /// </remarks>
    [JsonPropertyName("took")]
    public long Took { get; set; }

    /// <summary>
    /// Có mục thất bại hay không
    /// </summary>
    [JsonPropertyName("errors")]
    public bool Errors { get; set; }

    /// <summary>
    /// Kết quả xử lý của từng bản ghi
    /// </summary>
    /// <remarks>
    /// Khóa của mỗi phần tử là hành động (index/create/update) đã dùng khi gửi
    /// </remarks>
    [JsonPropertyName("items")]
    public Dictionary<string, JsonBulkItem>[] Items { get; set; } = [];
}
