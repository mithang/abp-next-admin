using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
/// <summary>
/// Tham số yêu cầu cập nhật phòng ban
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90205" />
/// </remarks>
public class WeChatWorkUpdateDepartmentRequest : WeChatWorkRequest
{
    /// <summary>
    /// id bộ phận
    /// </summary>
    [NotNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int Id { get; }
    /// <summary>
    /// Tên bộ phận. Giới hạn độ dài 1~64 ký tự UTF-8
    /// </summary>
    [CanBeNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    /// <summary>
    /// Tên tiếng Anh, cần bật hỗ trợ đa ngôn ngữ trong bảng quản trị mới có hiệu lực. Giới hạn độ dài 1~64 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("name_en")]
    [JsonPropertyName("name_en")]
    public string? NameEn { get; set; }
    /// <summary>
    /// id bộ phận cha
    /// </summary>
    [CanBeNull]
    [JsonProperty("parentid")]
    [JsonPropertyName("parentid")]
    public int? ParentId { get; set; }
    /// <summary>
    /// Giá trị thứ tự trong bộ phận cha. Giá trị order càng lớn càng xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }
    public WeChatWorkUpdateDepartmentRequest(int id)
    {
        Id = id;
    }

    protected override void Validate()
    {
        Check.NotNullOrWhiteSpace(Name, nameof(Name), 64, 1);
        Check.Length(NameEn, nameof(NameEn), 64, 1);
    }
}
