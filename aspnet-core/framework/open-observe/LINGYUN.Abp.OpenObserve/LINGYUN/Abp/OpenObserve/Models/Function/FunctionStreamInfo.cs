using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Function;

/// <summary>
/// Liên kết giữa hàm và luồng dữ liệu
/// </summary>
public class FunctionStreamInfo
{
    /// <summary>
    /// Tên luồng dữ liệu
    /// </summary>
    [JsonPropertyName("stream")]
    public string? Stream { get; set; }

    /// <summary>
    /// Thứ tự thực thi, giá trị càng nhỏ càng chạy trước
    /// </summary>
    [JsonPropertyName("order")]
    public int? Order { get; set; }

    /// <summary>
    /// Loại luồng dữ liệu
    /// </summary>
    [JsonPropertyName("streamType")]
    public string? StreamType { get; set; }

    /// <summary>
    /// Có xóa hay không
    /// </summary>
    [JsonPropertyName("isRemoved")]
    public bool? IsRemoved { get; set; }

    /// <summary>
    /// Có thực thi trước khi làm phẳng hay không
    /// </summary>
    [JsonPropertyName("applyBeforeFlattening")]
    public bool? ApplyBeforeFlattening { get; set; }
}
