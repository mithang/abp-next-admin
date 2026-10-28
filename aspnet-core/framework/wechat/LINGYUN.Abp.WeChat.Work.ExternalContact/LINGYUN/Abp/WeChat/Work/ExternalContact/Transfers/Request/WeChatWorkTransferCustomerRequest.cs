using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
/// <summary>
/// Tham số yêu cầu phân bổ khách hàng của thành viên đang làm việc
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92125" />
/// </remarks>
public class WeChatWorkTransferCustomerRequest : WeChatWorkRequest
{
    /// <summary>
    /// userid của thành viên theo dõi ban đầu
    /// </summary>
    [NotNull]
    [JsonProperty("handover_userid")]
    [JsonPropertyName("handover_userid")]
    public string HandoverUserId { get; }
    /// <summary>
    /// userid của thành viên tiếp nhận
    /// </summary>
    [NotNull]
    [JsonProperty("takeover_userid")]
    [JsonPropertyName("takeover_userid")]
    public string TakeoverUserId { get; }
    /// <summary>
    /// Danh sách external_userid của khách hàng, mỗi lần phân bổ tối đa 100 khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("external_userid")]
    [JsonPropertyName("external_userid")]
    public string[] ExternalUserId { get; }
    /// <summary>
    /// Tin nhắn gửi cho khách hàng sau khi chuyển giao thành công, tối đa 200 ký tự, nếu không điền thì dùng văn bản mặc định
    /// </summary>
    [CanBeNull]
    [JsonProperty("transfer_success_msg")]
    [JsonPropertyName("transfer_success_msg")]
    public string? TransferSuccessMsg { get; set; }
    public WeChatWorkTransferCustomerRequest(string handoverUserId, string takeoverUserId, string[] externalUserId, string? transferSuccessMsg = null)
    {
        Check.NotNullOrWhiteSpace(handoverUserId, nameof(handoverUserId));
        Check.NotNullOrWhiteSpace(takeoverUserId, nameof(takeoverUserId));
        Check.NotNullOrEmpty(externalUserId, nameof(externalUserId));
        Check.Length(transferSuccessMsg, nameof(transferSuccessMsg), 200);

        HandoverUserId = handoverUserId;
        TakeoverUserId = takeoverUserId;
        ExternalUserId = externalUserId;
        TransferSuccessMsg = transferSuccessMsg;
    }

    protected override void Validate()
    {
        Check.Length(TransferSuccessMsg, nameof(TransferSuccessMsg), 200);
    }
}
