using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.User;

/// <summary>
/// Yêu cầu tạo người dùng
/// </summary>
public class CreateUserRequest
{
    /// <summary>
    /// Email
    /// </summary>
    [JsonPropertyName("email")]
    public string Email { get; set; } = default!;

    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    /// <summary>
    /// Mật khẩu
    /// </summary>
    [JsonPropertyName("password")]
    public string Password { get; set; } = default!;

    /// <summary>
    /// Vai trò
    /// </summary>
    /// <remarks>
    /// admin / user
    /// </remarks>
    [JsonPropertyName("role")]
    public string? Role { get; set; }
}
