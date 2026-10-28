using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Yêu cầu kiểm tra hàm
/// </summary>
/// <remarks>
/// POST /api/{org_id}/functions/test
/// Lưu ý: giao diện này không xuất hiện trong tài liệu API, nó đến từ mã nguồn triển khai
/// </remarks>
public class TestFunctionRequest
{
    /// <summary>
    /// Thân hàm
    /// </summary>
    [JsonPropertyName("function")]
    public string Function { get; set; } = default!;

    /// <summary>
    /// Dữ liệu mẫu dùng để kiểm tra
    /// </summary>
    [JsonPropertyName("events")]
    public JsonNode[] Events { get; set; } = [];

    /// <summary>
    /// Ngôn ngữ của hàm
    /// </summary>
    /// <remarks>
    /// Khi không truyền, phía máy chủ sẽ tự động nhận dạng
    /// </remarks>
    [JsonPropertyName("trans_type")]
    public FunctionTransType? TransType { get; set; }
}
