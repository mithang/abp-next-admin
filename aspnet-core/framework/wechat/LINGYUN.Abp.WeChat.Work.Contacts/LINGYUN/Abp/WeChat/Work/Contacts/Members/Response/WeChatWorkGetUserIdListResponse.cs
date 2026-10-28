using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách ID thành viên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/96067" />
/// </remarks>
public class WeChatWorkGetUserIdListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách quan hệ người dùng - phòng ban
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
    /// <summary>
    /// Con trỏ phân trang, điền vào lần yêu cầu tiếp theo để lấy các bản ghi của trang sau. Nếu trường này trả về rỗng thì nghĩa là không còn dữ liệu nữa
    /// </summary>
    [NotNull]
    [JsonProperty("dept_user")]
    [JsonPropertyName("dept_user")]
    public DepartmentUser[] DepartmentUser { get; set; } = default!;
}
