using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Ingestion;

/// <summary>
/// Dòng hành động _bulk
/// </summary>
/// <remarks>
/// {"index":{"_index":"stream1"}}, tên hành động (index/create/update) được quyết định bởi khóa của từ điển ngoài
/// </remarks>
public class JsonBulkRequest
{
    /// <summary>
    /// Tên luồng dữ liệu
    /// </summary>
    [JsonPropertyName("_index")]
    public string Index { get; set; } = default!;
}
