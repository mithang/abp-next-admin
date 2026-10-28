using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
/// <summary>
/// Tham số yêu cầu phân bổ khách hàng của thành viên đã nghỉ việc
/// </summary>
public class WeChatWorkResignedTransferCustomerRequest : WeChatWorkRequest
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
    public WeChatWorkResignedTransferCustomerRequest(string handoverUserId, string takeoverUserId, string[] externalUserId)
    {
        Check.NotNullOrWhiteSpace(handoverUserId, nameof(handoverUserId));
        Check.NotNullOrWhiteSpace(takeoverUserId, nameof(takeoverUserId));
        Check.NotNullOrEmpty(externalUserId, nameof(externalUserId));

        HandoverUserId = handoverUserId;
        TakeoverUserId = takeoverUserId;
        ExternalUserId = externalUserId;
    }

    protected override void Validate()
    {
        if (ExternalUserId.Length > 100)
        {
            throw new ArgumentException("Transfer a maximum of 100 customers at a time!");
        }
    }
}
