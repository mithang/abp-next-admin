using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.Setting;
/// <summary>
/// Kênh gửi
/// </summary>
public class PushPlusChannel
{
    /// <summary>
    /// Mã kênh mặc định
    /// </summary>
    [JsonProperty("defaultChannel")]
    public string? DefaultChannel { get; set; }
    /// <summary>
    /// Tên kênh mặc định
    /// </summary>
    [JsonProperty("defaultChannelTxt")]
    public string? DefaultChannelName { get; set; }
    /// <summary>
    /// Tham số kênh
    /// </summary>
    [JsonProperty("defaultWebhook")]
    public string? DefaultWebhook { get; set; }
    /// <summary>
    /// Giới hạn gửi; 0 - không giới hạn, 1 - cấm tất cả các kênh gửi, 2 - giới hạn kênh WeChat, 3 - giới hạn kênh email
    /// </summary>
    [JsonProperty("sendLimit")]
    public PushPlusChannelRecevieLimit SendLimit { get; set; }
    /// <summary>
    /// Giới hạn nhận; 0 - nhận tất cả, 1 - không nhận tin nhắn
    /// </summary>
    [JsonProperty("recevieLimit")]
    public PushPlusChannelRecevieLimit RecevieLimit { get; set; }

}
