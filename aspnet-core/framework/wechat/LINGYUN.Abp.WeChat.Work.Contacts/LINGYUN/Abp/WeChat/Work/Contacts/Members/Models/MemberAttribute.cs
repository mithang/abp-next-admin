using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Thuộc tính mở rộng của thành viên
/// </summary>
public abstract class MemberAttribute
{
    /// <summary>
    /// Tên thuộc tính: khi thêm mới hoặc cập nhật, cần đảm bảo thuộc tính đã được tạo ở phía quản trị trước, nếu không sẽ bị bỏ qua
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// Loại thuộc tính
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public AttributeType Type { get; set; }
}
