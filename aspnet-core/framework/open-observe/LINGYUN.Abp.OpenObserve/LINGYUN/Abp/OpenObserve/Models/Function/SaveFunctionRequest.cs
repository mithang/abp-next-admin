using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Yêu cầu tạo/cập nhật hàm
/// </summary>
public class SaveFunctionRequest
{
    /// <summary>
    /// Tên hàm
    /// </summary>
    /// <remarks>
    /// Giao diện cập nhật lấy tham số đường dẫn làm chuẩn
    /// </remarks>
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Thân hàm
    /// </summary>
    [JsonPropertyName("function")]
    public string Function { get; set; } = default!;

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
    /// Thứ tự thực thi
    /// </summary>
    /// <remarks>
    /// Ví dụ tài liệu có chứa trường này, nhưng phía triển khai hiện tại không chấp nhận, giữ lại để tương thích với cách gọi theo tài liệu
    /// </remarks>
    [JsonPropertyName("order")]
    public int? Order { get; set; }
}
