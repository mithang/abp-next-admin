using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Phản hồi giá trị trường
/// </summary>
/// <remarks>
/// GET /api/{organization}/{stream}/_values
/// Tham khảo: https://openobserve.ai/docs/reference/api/search/
/// </remarks>
public class ValuesResponse
{
    [JsonPropertyName("took")]
    public long Took { get; set; }

    /// <summary>
    /// Chi tiết thời gian tiêu tốn
    /// </summary>
    [JsonPropertyName("took_detail")]
    public SearchTookDetail? TookDetail { get; set; }

    [JsonPropertyName("hits")]
    public ValuesHit[] Hits { get; set; } = [];

    [JsonPropertyName("total")]
    public long Total { get; set; }

    [JsonPropertyName("from")]
    public long From { get; set; }

    [JsonPropertyName("size")]
    public long Size { get; set; }

    [JsonPropertyName("scan_size")]
    public long ScanSize { get; set; }
}
