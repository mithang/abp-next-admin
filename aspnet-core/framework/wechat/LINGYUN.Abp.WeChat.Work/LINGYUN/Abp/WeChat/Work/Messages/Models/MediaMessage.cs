using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn tệp phương tiện
/// </summary>
public class MediaMessage
{
    /// <summary>
    ///id tệp phương tiện, có thể lấy bằng cách gọi API tải lên tài nguyên tạm thời
    /// </summary>
    [NotNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string MediaId { get; set; }

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public MediaMessage(string mediaId)
    {
        MediaId = mediaId;
    }
}
