using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
/// <summary>
/// Chi tiết nhóm không thể kế thừa thành công
/// </summary>
public class GroupChatTransferFailed
{
    /// <summary>
    /// ID nhóm không thể kế thừa thành công
    /// </summary>
    [NotNull]
    [JsonProperty("chat_id")]
    [JsonPropertyName("chat_id")]
    public string ChatId { get; set; } = default!;
    /// <summary>
    /// Nhóm không thể kế thừa thành công, mã lỗi
    /// </summary>
    [NotNull]
    [JsonProperty("errcode")]
    [JsonPropertyName("errcode")]
    public int ErrCode { get; set; }
    /// <summary>
    /// Nhóm không thể kế thừa thành công, mô tả lỗi
    /// </summary>
    [NotNull]
    [JsonProperty("errmsg")]
    [JsonPropertyName("errmsg")]
    public string ErrMsg { get; set; } = default!;
}
