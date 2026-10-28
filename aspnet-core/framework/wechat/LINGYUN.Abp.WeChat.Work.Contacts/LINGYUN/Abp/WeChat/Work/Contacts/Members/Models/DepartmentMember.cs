using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Thành viên phòng ban
/// </summary>
public class DepartmentMember
{
    /// <summary>
    /// UserID của thành viên. Tương ứng với tài khoản ở phía quản trị
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Tên thành viên, ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền mới trả về
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// Danh sách phòng ban mà thành viên thuộc về. Mỗi mục trong danh sách là ID phòng ban, số nguyên 32 bit
    /// </summary>
    [CanBeNull]
    [JsonProperty("department")]
    [JsonPropertyName("department")]
    public int[]? Department { get; set; }
    /// <summary>
    /// Duy nhất toàn cục
    /// </summary>
    [NotNull]
    [JsonProperty("open_userid")]
    [JsonPropertyName("open_userid")]
    public string OpenUserId { get; set; } = default!;
}
