using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.User;

/// <summary>
/// Yêu cầu cập nhật người dùng
/// </summary>
public class UpdateUserRequest
{
    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    /// <summary>
    /// Mật khẩu cũ
    /// </summary>
    /// <remarks>
    /// Không truyền giá trị khi không đổi mật khẩu
    /// </remarks>
    [JsonPropertyName("old_password")]
    public string? OldPassword { get; set; }

    /// <summary>
    /// Mật khẩu mới
    /// </summary>
    /// <remarks>
    /// Không truyền giá trị khi không đổi mật khẩu
    /// </remarks>
    [JsonPropertyName("new_password")]
    public string? NewPassword { get; set; }

    /// <summary>
    /// Vai trò
    /// </summary>
    [JsonPropertyName("role")]
    public string? Role { get; set; }
}
