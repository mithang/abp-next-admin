using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Response;
/// <summary>
/// Kết quả phản hồi lấy chi tiết nhóm khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92122" />
/// </remarks>
public class WeChatWorkGetGroupChatResponse : WeChatWorkResponse
{
    /// <summary>
    /// Chi tiết nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("group_chat")]
    [JsonPropertyName("group_chat")]
    public GroupChatInfo GroupChat { get; set; } = default!;
}
