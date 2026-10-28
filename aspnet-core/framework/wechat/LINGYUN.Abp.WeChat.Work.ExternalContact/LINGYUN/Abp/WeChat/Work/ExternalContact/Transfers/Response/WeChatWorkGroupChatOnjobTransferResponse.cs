using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
/// <summary>
/// Kết quả phản hồi phân bổ nhóm khách hàng cho thành viên đang làm việc
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/95703" />
/// </remarks>
public class WeChatWorkGroupChatOnjobTransferResponse : WeChatWorkResponse
{
    /// <summary>
    /// Nhóm không thể kế thừa thành công
    /// </summary>
    [NotNull]
    [JsonProperty("failed_chat_list")]
    [JsonPropertyName("failed_chat_list")]
    public GroupChatTransferFailed[] FailedChatList { get; set; } = default!;
}
