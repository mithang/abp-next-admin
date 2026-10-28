using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.User;

/// <summary>
/// Yêu cầu thêm người dùng vào tổ chức
/// </summary>
public class AddUserToOrganizationRequest
{
    /// <summary>
    /// Vai trò
    /// </summary>
    /// <remarks>
    /// admin / user
    /// </remarks>
    [JsonPropertyName("role")]
    public string? Role { get; set; }
}
