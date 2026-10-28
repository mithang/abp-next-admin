using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Quan hệ người dùng - phòng ban
/// </summary>
public class DepartmentUser
{
    /// <summary>
    /// Userid của người dùng, khi người dùng thuộc nhiều phòng ban sẽ có nhiều bản ghi
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Phòng ban của người dùng
    /// </summary>
    [NotNull]
    [JsonProperty("department")]
    [JsonPropertyName("department")]
    public int Department { get; set; } = default!;
}
