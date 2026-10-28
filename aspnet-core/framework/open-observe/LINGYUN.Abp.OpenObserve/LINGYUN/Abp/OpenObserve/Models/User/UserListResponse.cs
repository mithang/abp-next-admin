using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.User;

/// <summary>
/// Phản hồi danh sách người dùng
/// </summary>
/// <remarks>
/// Phản hồi thực tế là {"data":[...]}, ví dụ trong tài liệu là {"list":[...]}, cả hai đều được hỗ trợ tương thích
/// </remarks>
public class UserListResponse
{
    /// <summary>
    /// Danh sách người dùng
    /// </summary>
    [JsonPropertyName("data")]
    public UserInfo[]? Data { get; set; }

    /// <summary>
    /// Danh sách người dùng
    /// </summary>
    [JsonPropertyName("list")]
    public UserInfo[]? List { get; set; }

    /// <summary>
    /// Danh sách người dùng
    /// </summary>
    [JsonIgnore]
    public UserInfo[] Users => Data ?? List ?? [];
}
