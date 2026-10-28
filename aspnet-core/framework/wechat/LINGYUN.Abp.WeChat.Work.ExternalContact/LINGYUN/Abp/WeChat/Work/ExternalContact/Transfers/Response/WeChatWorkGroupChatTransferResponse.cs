using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
/// <summary>
/// Kết quả phản hồi phân bổ nhóm khách hàng của thành viên đã nghỉ việc
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92127" />
/// </remarks>
public class WeChatWorkGroupChatTransferResponse : WeChatWorkResponse
{
    /// <summary>
    /// Nhóm chưa được kế thừa thành công
    /// </summary>
    [NotNull]
    [JsonProperty("failed_chat_list")]
    [JsonPropertyName("failed_chat_list")]
    public GroupChatTransferFailed[] FailedChatList { get; set; } = default!;
}
