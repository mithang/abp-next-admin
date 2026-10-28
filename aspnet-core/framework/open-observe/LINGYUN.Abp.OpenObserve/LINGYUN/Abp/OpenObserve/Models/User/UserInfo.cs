using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.User;

/// <summary>
/// Thông tin người dùng
/// </summary>
public class UserInfo
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = default!;

    /// <summary>
    /// Tên
    /// </summary>
    /// <remarks>
    /// Ví dụ phản hồi trong tài liệu viết nhầm thành fist_name, ở đây dùng first_name theo bảng trường và xử lý dự phòng qua thuộc tính mở rộng
    /// </remarks>
    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    /// <summary>
    /// Vai trò
    /// </summary>
    /// <remarks>
    /// admin / user / root
    /// </remarks>
    [JsonPropertyName("role")]
    public string? Role { get; set; }

    /// <summary>
    /// Có phải người dùng bên ngoài hay không
    /// </summary>
    [JsonPropertyName("is_external")]
    public bool? IsExternal { get; set; }

    /// <summary>
    /// Thời gian tạo (micro giây)
    /// </summary>
    [JsonPropertyName("created_at")]
    public long? CreatedAt { get; set; }

    /// <summary>
    /// Các trường chưa được khai báo trong mô hình
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? ExtraProperties { get; set; }
}
