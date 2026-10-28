using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi mời thành viên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90975" />
/// </remarks>
public class WeChatWorkBulkInviteMemberResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách thành viên không hợp lệ
    /// </summary>
    [NotNull]
    [JsonProperty("invaliduser")]
    [JsonPropertyName("invaliduser")]
    public string[] InvalidUser { get; set; } = default!;
    /// <summary>
    /// Danh sách phòng ban không hợp lệ
    /// </summary>
    [NotNull]
    [JsonProperty("invalidparty")]
    [JsonPropertyName("invalidparty")]
    public int[] InvalidParty { get; set; } = default!;
    /// <summary>
    /// Danh sách nhãn không hợp lệ
    /// </summary>
    [NotNull]
    [JsonProperty("invalidtag")]
    [JsonPropertyName("invalidtag")]
    public int[] InvalidTag { get; set; } = default!;
}