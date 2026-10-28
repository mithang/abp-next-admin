using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
/// <summary>
/// Tham số yêu cầu truy vấn trạng thái bàn giao khách hàng của thành viên đã nghỉ việc
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/94082" />
/// </remarks>
public class WeChatWorkGetResignedTransferResultRequest : WeChatWorkRequest
{
    /// <summary>
    /// Userid của thành viên đã thêm ban đầu
    /// </summary>
    [NotNull]
    [JsonProperty("handover_userid")]
    [JsonPropertyName("handover_userid")]
    public string HandOverUserId { get; }
    /// <summary>
    /// Userid của thành viên bàn giao
    /// </summary>
    [NotNull]
    [JsonProperty("takeover_userid")]
    [JsonPropertyName("takeover_userid")]
    public string TakeOverUserId { get; }
    /// <summary>
    /// Cursor truy vấn phân trang, dữ liệu trả về trên mỗi trang không vượt quá 1000 bản ghi; không điền hoặc để trống nghĩa là lấy trang đầu tiên
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; }
    public WeChatWorkGetResignedTransferResultRequest(
        string handOverUserId,
        string takeOverUserId,
        string? cursor = null)
    {
        Check.NotNullOrWhiteSpace(handOverUserId, nameof(handOverUserId));
        Check.NotNullOrWhiteSpace(takeOverUserId, nameof(takeOverUserId));

        HandOverUserId = handOverUserId;
        TakeOverUserId = takeOverUserId;
        Cursor = cursor;
    }
}
