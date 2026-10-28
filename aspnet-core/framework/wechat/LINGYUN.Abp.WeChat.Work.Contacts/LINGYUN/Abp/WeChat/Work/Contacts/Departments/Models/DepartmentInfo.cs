using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Models;
/// <summary>
/// Chi tiết phòng ban
/// </summary>
public class DepartmentInfo : Department
{
    /// <summary>
    /// Tên tiếng Anh của phòng ban
    /// </summary>
    [CanBeNull]
    [JsonProperty("name_en")]
    [JsonPropertyName("name_en")]
    public string? NameEn { get; set; }
    /// <summary>
    /// UserID của người phụ trách phòng ban, trả về danh sách người phụ trách phòng ban trong phạm vi hiển thị của ứng dụng
    /// </summary>
    [NotNull]
    [JsonProperty("department_leader")]
    [JsonPropertyName("department_leader")]
    public string[] DepartmentLeader { get; set; } = default!;
    /// <summary>
    /// Id của phòng ban cha. Phòng ban gốc là 1
    /// </summary>
    [NotNull]
    [JsonProperty("parentid")]
    [JsonPropertyName("parentid")]
    public int ParentId { get; set; }
    /// <summary>
    /// Giá trị thứ tự trong phòng ban cha. Giá trị order lớn được sắp xếp lên trước. Phạm vi giá trị là [0, 2^32)
    /// </summary>
    [NotNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int Order { get; set; }
}
