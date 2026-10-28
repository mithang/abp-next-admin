using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System.Xml.Linq;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
/// <summary>
/// Tham số yêu cầu tạo phòng ban
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90205" />
/// </remarks>
public class WeChatWorkCreateDepartmentRequest : WeChatWorkRequest
{
    /// <summary>
    /// Tên bộ phận. Tên các bộ phận cùng cấp không được trùng nhau. Giới hạn độ dài 1~64 ký tự UTF-8
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; }
    /// <summary>
    /// Tên tiếng Anh. Tên các bộ phận cùng cấp không được trùng nhau. Cần bật hỗ trợ đa ngôn ngữ trong bảng quản trị mới có hiệu lực. Giới hạn độ dài 1~64 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("name_en")]
    [JsonPropertyName("name_en")]
    public string? NameEn { get; set; }
    /// <summary>
    /// id bộ phận cha, số nguyên 32 bit
    /// </summary>
    [NotNull]
    [JsonProperty("parentid")]
    [JsonPropertyName("parentid")]
    public int ParentId { get; }
    /// <summary>
    /// Giá trị thứ tự trong bộ phận cha. Giá trị order càng lớn càng xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int? Order { get; set; }
    /// <summary>
    /// id bộ phận, số nguyên 32 bit, khi chỉ định phải lớn hơn 1. Nếu không điền tham số này, id sẽ tự động được tạo
    /// </summary>
    [CanBeNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int? Id { get; set; }
    public WeChatWorkCreateDepartmentRequest(string name, int parentId = 0, string? nameEn = null, int? order = null, int? id = null)
    {
        Check.NotNullOrWhiteSpace(name, nameof(name), 64, 1);
        Check.Length(nameEn, nameof(nameEn), 64, 1);

        Name = name;
        NameEn = nameEn;
        ParentId = parentId;
        Order = order;
        Id = id;
    }

    protected override void Validate()
    {
        Check.NotNullOrWhiteSpace(Name, nameof(Name), 64, 1);
        Check.Length(NameEn, nameof(NameEn), 64, 1);
    }
}
