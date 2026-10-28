using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn văn bản Webhook
/// </summary>
public class WebhookTextMessage
{
    /// <summary>
    /// Nội dung văn bản tin nhắn, tối đa không quá 2048 byte, phải là mã hoá utf8
    /// </summary>
    [NotNull]
    [StringLength(2048)]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; }
    /// <summary>
    /// Danh sách userid, nhắc đến thành viên cụ thể trong nhóm (@một thành viên), @all nghĩa là nhắc tất cả mọi người; nếu nhà phát triển không lấy được userid thì có thể dùng mentioned_mobile_list
    /// </summary>
    [NotNull]
    [JsonProperty("mentioned_list")]
    [JsonPropertyName("mentioned_list")]
    public List<string> MentionedList { get; set; }
    /// <summary>
    /// Danh sách số điện thoại, nhắc đến thành viên nhóm tương ứng với số điện thoại (@một thành viên), @all nghĩa là nhắc tất cả mọi người
    /// </summary>
    [NotNull]
    [StringLength(2048)]
    [JsonProperty("mentioned_mobile_list")]
    [JsonPropertyName("mentioned_mobile_list")]
    public List<string> MentionedMobileList { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn văn bản Webhook
    /// </summary>
    /// <param name="content">Nội dung tin nhắn</param>
    public WebhookTextMessage(string content)
    {
        Content = Check.NotNullOrWhiteSpace(content, nameof(content), 2048);

        MentionedList = new List<string>();
        MentionedMobileList = new List<string>();
    }
}
