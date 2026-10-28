using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Thông tin hàm
/// </summary>
/// <remarks>
/// Bảng trường tài liệu dùng đặt tên gạch dưới (stream_name/num_args/trans_type), phía triển khai trả về camelCase (numArgs/transType/streams)
/// Các trường chưa khai báo được giữ lại qua thuộc tính mở rộng
/// </remarks>
public class FunctionInfo
{
    /// <summary>
    /// Tên hàm
    /// </summary>
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Thân hàm
    /// </summary>
    [JsonPropertyName("function")]
    public string? Function { get; set; }

    /// <summary>
    /// Tham số hàm
    /// </summary>
    [JsonPropertyName("params")]
    public string? Params { get; set; }

    /// <summary>
    /// Số lượng tham số
    /// </summary>
    [JsonPropertyName("numArgs")]
    public int? NumArgs { get; set; }

    /// <summary>
    /// Ngôn ngữ hàm
    /// </summary>
    [JsonPropertyName("transType")]
    public FunctionTransType? TransType { get; set; }

    /// <summary>
    /// Luồng dữ liệu mà hàm có hiệu lực
    /// </summary>
    [JsonPropertyName("streams")]
    public FunctionStreamInfo[]? Streams { get; set; }

    /// <summary>
    /// Trường chưa được khai báo trong mô hình
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? ExtraProperties { get; set; }
}
