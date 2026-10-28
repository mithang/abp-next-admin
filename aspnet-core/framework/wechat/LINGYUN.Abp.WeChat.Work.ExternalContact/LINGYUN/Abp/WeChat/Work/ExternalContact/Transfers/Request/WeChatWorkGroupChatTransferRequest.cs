using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
/// <summary>
/// Tham số yêu cầu phân bổ nhóm khách hàng của thành viên đã nghỉ việc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92127" />
/// </remarks>
public class WeChatWorkGroupChatTransferRequest : WeChatWorkRequest
{
    /// <summary>
    /// ID chủ nhóm mới
    /// </summary>
    [NotNull]
    [JsonProperty("new_owner")]
    [JsonPropertyName("new_owner")]
    public string NewOwner { get; }
    /// <summary>
    /// Danh sách ID nhóm khách hàng cần chuyển chủ nhóm. Phạm vi giá trị: 1 ~ 100
    /// </summary>
    [NotNull]
    [JsonProperty("chat_id_list")]
    [JsonPropertyName("chat_id_list")]
    public string[] ChatIdList { get; }
    public WeChatWorkGroupChatTransferRequest(string newOwner, string[] chatIdList)
    {
        Check.NotNullOrWhiteSpace(newOwner, nameof(newOwner));
        Check.NotNullOrEmpty(chatIdList, nameof(chatIdList));

        if (chatIdList.Length < 1 || chatIdList.Length > 100)
        {
            throw new ArgumentException("The list of customer group ids that need to be transferred to the group owner must have more than 1 item or less than 100 items");
        }

        NewOwner = newOwner;
        ChatIdList = chatIdList;
    }
}
