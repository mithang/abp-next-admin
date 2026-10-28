using Newtonsoft.Json;

namespace LINGYUN.Abp.WeChat.Work.Media.Models;
public class WeChatWorkImageResponse : WeChatWorkResponse
{
    /// <summary>
    /// URL hình ảnh nhận được sau khi tải lên. Có hiệu lực vĩnh viễn
    /// </summary>
    [JsonProperty("url")]
    public string Url { get; set; } = default!;
}
