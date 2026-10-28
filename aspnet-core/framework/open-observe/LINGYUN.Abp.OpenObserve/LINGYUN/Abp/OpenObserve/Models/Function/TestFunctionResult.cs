using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Kết quả hàm kiểm thử
/// </summary>
public class TestFunctionResult
{
    /// <summary>
    /// Thông báo xử lý
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }

    /// <summary>
    /// Dữ liệu sau xử lý
    /// </summary>
    [JsonPropertyName("event")]
    public JsonNode? Event { get; set; }
}
