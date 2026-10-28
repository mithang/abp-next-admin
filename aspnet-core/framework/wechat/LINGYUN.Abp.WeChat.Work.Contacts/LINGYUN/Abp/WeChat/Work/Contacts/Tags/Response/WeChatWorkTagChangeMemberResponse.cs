using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags.Response;
/// <summary>
/// Tham số phản hồi thay đổi thành viên nhãn
/// </summary>
public class WeChatWorkTagChangeMemberResponse : WeChatWorkResponse
{
    /// <summary>
    /// Nếu một phần userid không hợp lệ, trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("invalidlist")]
    [JsonPropertyName("invalidlist")]
    public string? InvalidList { get; set; }
    /// <summary>
    /// Nếu một phần partylist không hợp lệ, trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("invalidparty")]
    [JsonPropertyName("invalidparty")]
    public int[]? InvalidPart { get; set; }
}
