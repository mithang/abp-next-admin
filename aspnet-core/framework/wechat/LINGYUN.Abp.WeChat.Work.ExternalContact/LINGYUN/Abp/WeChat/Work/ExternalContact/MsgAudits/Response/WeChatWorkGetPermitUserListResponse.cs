using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách thành viên đã bật lưu trữ nội dung phiên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/91614" />
/// </remarks>
public class WeChatWorkGetPermitUserListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách userid của các thành viên nằm trong phạm vi đã bật
    /// </summary>
    [NotNull]
    [JsonProperty("ids")]
    [JsonPropertyName("ids")]
    public string[] Ids { get; set; } = default!;
}
