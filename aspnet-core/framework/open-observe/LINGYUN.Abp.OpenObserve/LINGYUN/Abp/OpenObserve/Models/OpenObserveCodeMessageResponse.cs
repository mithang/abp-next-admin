using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models;

/// <summary>
/// Phản hồi chung của OpenObserve
/// </summary>
/// <remarks>
/// Hầu hết các API thao tác ghi trả về {"code":200,"message":"..."}
/// </remarks>
public class OpenObserveCodeMessageResponse
{
    /// <summary>
    /// Mã trạng thái
    /// </summary>
    [JsonPropertyName("code")]
    public int Code { get; set; }

    /// <summary>
    /// Thông báo
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }

    /// <summary>
    /// Yêu cầu có thành công hay không
    /// </summary>
    [JsonIgnore]
    public bool IsSuccess => Code is >= 200 and < 300;
}
