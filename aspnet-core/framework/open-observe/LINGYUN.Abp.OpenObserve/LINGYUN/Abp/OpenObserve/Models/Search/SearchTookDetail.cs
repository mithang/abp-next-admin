using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Chi tiết thời gian tốn của tìm kiếm
/// </summary>
public class SearchTookDetail
{
    /// <summary>
    /// Tổng thời gian tốn (mili giây)
    /// </summary>
    [JsonPropertyName("total")]
    public long Total { get; set; }

    /// <summary>
    /// Thời gian tốn của bộ nhớ đệm (mili giây)
    /// </summary>
    [JsonPropertyName("cache_took")]
    public long CacheTook { get; set; }

    /// <summary>
    /// Thời gian tốn của danh sách tệp (mili giây)
    /// </summary>
    [JsonPropertyName("file_list_took")]
    public long FileListTook { get; set; }

    /// <summary>
    /// Thời gian chờ xếp hàng (mili giây)
    /// </summary>
    [JsonPropertyName("wait_in_queue")]
    public long WaitInQueue { get; set; }

    /// <summary>
    /// Thời gian tốn của chỉ mục (mili giây)
    /// </summary>
    [JsonPropertyName("idx_took")]
    public long IdxTook { get; set; }

    /// <summary>
    /// Thời gian tốn của truy vấn (mili giây)
    /// </summary>
    [JsonPropertyName("search_took")]
    public long SearchTook { get; set; }
}
