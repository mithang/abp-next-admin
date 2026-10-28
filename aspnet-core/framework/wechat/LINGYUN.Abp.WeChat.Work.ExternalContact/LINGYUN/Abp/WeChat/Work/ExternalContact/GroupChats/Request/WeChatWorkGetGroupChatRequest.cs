using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Request;
/// <summary>
/// Lấy chi tiết nhóm khách hàng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92122" />
/// </remarks>
public class WeChatWorkGetGroupChatRequest : WeChatWorkRequest
{
    /// <summary>
    /// ID nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("chat_id")]
    [JsonPropertyName("chat_id")]
    public string ChatId { get; }
    /// <summary>
    /// Có cần trả về tên thành viên nhóm group_chat.member_list.name hay không. 0-Không trả về; 1-Trả về. Mặc định không trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("need_name")]
    [JsonPropertyName("need_name")]
    public int? NeedName { get; }
    public WeChatWorkGetGroupChatRequest(string chatId, bool needName = false)
    {
        Check.NotNullOrWhiteSpace(chatId, nameof(chatId));

        ChatId = chatId;
        NeedName = needName ? 1 : 0;
    }
}
