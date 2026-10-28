using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Response;
/// <summary>
/// Tham số phản hồi lấy tình trạng đồng ý phiên nhóm trò chuyện
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91782" />
/// </remarks>
public class WeChatWorkCheckRoomAgreeResponse : WeChatWorkResponse
{
    /// <summary>
    /// Tình trạng đồng ý
    /// </summary>
    [NotNull]
    [JsonProperty("agreeinfo")]
    [JsonPropertyName("agreeinfo")]
    public RoomAgreeInfo[] AgreeInfo { get; set; } = default!;
}
