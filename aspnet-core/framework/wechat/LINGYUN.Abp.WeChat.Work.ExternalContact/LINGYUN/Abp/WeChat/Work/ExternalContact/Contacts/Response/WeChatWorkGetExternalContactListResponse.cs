using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Contacts.Response;
/// <summary>
/// Kết quả phản hồi lấy liên hệ bên ngoài đã phục vụ
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92994" />
/// </remarks>
public class WeChatWorkGetExternalContactListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("info_list")]
    [JsonPropertyName("info_list")]
    public ExternalContactInfo[] InfoList { get; set; } = default!;
    /// <summary>
    /// Con trỏ phân trang, điền vào lần yêu cầu tiếp theo nữa để lấy các bản ghi của trang sau, nếu đã không còn dữ liệu nữa thì trả về rỗng, hiệu lực trong 4 giờ
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
}
