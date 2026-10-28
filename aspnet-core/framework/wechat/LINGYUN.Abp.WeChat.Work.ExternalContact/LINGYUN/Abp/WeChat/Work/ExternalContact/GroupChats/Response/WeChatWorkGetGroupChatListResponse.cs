using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Response;
/// <summary>
/// Kết quả phản hồi lấy danh sách nhóm khách hàng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92120" />
/// </remarks>
public class WeChatWorkGetGroupChatListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("group_chat_list")]
    [JsonPropertyName("group_chat_list")]
    public GroupChat[] GroupChatList { get; set; } = default!;
    /// <summary>
    /// Con trỏ phân trang, điền vào lần yêu cầu tiếp theo để lấy các bản ghi của trang sau. Nếu trường này trả về rỗng thì nghĩa là không còn dữ liệu nữa
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
}
