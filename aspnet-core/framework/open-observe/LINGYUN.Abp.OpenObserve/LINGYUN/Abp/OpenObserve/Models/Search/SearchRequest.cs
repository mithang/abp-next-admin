using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Yêu cầu tìm kiếm
/// </summary>
public class SearchRequest
{
    /// <summary>
    /// Điều kiện truy vấn
    /// </summary>
    [JsonPropertyName("query")]
    public SearchQuery Query { get; }

    /// <summary>
    /// Nguồn tìm kiếm
    /// </summary>
    /// <remarks>
    /// Hỗ trợ ui / dashboards / reports / alerts, v.v.; giá trị trong thân yêu cầu được ưu tiên hơn chuỗi truy vấn
    /// </remarks>
    [JsonPropertyName("search_type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SearchTypeString { get; set; }

    /// <summary>
    /// Thời gian chờ (giây)
    /// </summary>
    /// <remarks>
    /// Giá trị mặc định do phía máy chủ ZO_QUERY_TIMEOUT=600 quyết định
    /// </remarks>
    [JsonPropertyName("timeout")]
    public int? Timeout { get; }

    /// <summary>
    /// Tùy chọn client agent/MCP
    /// </summary>
    [JsonPropertyName("agent_options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SearchAgentOptions? AgentOptions { get; }

    /// <summary>
    /// Cách mã hóa SQL
    /// </summary>
    /// <remarks>
    /// Để trống hoặc base64; khi là base64 thì query.sql cần được mã hóa URL Base64, phía máy chủ giải mã xong sẽ để trống
    /// </remarks>
    [JsonPropertyName("encoding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Encoding { get; set; }

    /// <summary>
    /// Khu vực truy vấn
    /// </summary>
    /// <remarks>
    /// Mặc định truy vấn tất cả các khu vực, local nghĩa là chỉ khu vực cục bộ
    /// </remarks>
    [JsonPropertyName("regions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? Regions { get; set; }

    /// <summary>
    /// Cụm truy vấn
    /// </summary>
    /// <remarks>
    /// local nghĩa là chỉ cụm cục bộ
    /// </remarks>
    [JsonPropertyName("clusters")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? Clusters { get; set; }

    /// <summary>
    /// Có sử dụng bộ nhớ đệm hay không
    /// </summary>
    /// <remarks>
    /// use_cache trong chuỗi truy vấn sẽ ghi đè giá trị này
    /// </remarks>
    [JsonPropertyName("use_cache")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? UseCache { get; set; }

    /// <summary>
    /// Có xóa bộ nhớ đệm hay không
    /// </summary>
    /// <remarks>
    /// clear_cache trong chuỗi truy vấn sẽ ghi đè giá trị này
    /// </remarks>
    [JsonPropertyName("clear_cache")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ClearCache { get; set; }

    public SearchRequest(
        SearchQuery query,
        SearchType? searchType = null,
        int? timeout = OpenObserveConstants.ZO_QUERY_TIMEOUT,
        SearchAgentOptions? agentOptions = null)
    {
        Query = query;
        Timeout = timeout;
        AgentOptions = agentOptions;
        SearchTypeString = searchType?.AsString();
    }
}
