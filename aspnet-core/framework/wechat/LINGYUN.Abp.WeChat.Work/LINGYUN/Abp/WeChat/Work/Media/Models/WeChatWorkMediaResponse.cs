using Newtonsoft.Json;

namespace LINGYUN.Abp.WeChat.Work.Media.Models;
public class WeChatWorkMediaResponse : WeChatWorkResponse
{
    /// <summary>
    /// Loại tệp phương tiện
    /// </summary>
    /// <remarks>
    /// Hình ảnh (image)
    /// Giọng nói (voice)
    /// Video (video)
    /// Tệp thông thường (file)
    /// </remarks>
    [JsonProperty("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// Định danh duy nhất thu được sau khi tải lên tệp phương tiện, có hiệu lực trong 3 ngày
    /// </summary>
    [JsonProperty("media_id")]
    public string MediaId { get; set; } = default!;
    /// <summary>
    /// Dấu thời gian tải lên tệp phương tiện
    /// </summary>
    [JsonProperty("created_at")]
    public string CreatedAt { get; set; } = default!;
}
