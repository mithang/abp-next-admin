using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.PushPlus.Channel.Webhook;
/// <summary>
/// webhook
/// </summary>
public class PushPlusWebhook
{
    /// <summary>
    /// Số hiệu webhook
    /// </summary>
    [JsonProperty("id")]
    public int Id { get; set; }
    /// <summary>
    /// Mã webhook
    /// </summary>
    [JsonProperty("webhookCode")]
    public string WebhookCode { get; set; } = default!;
    /// <summary>
    /// Tên webhook
    /// </summary>
    [JsonProperty("webhookName")]
    public string WebhookName { get; set; } = default!;
    /// <summary>
    /// Loại webhook;
    /// 1-WeChat Work,
    /// 2-DingTalk,
    /// 3-Feishu,
    /// 4-ServerChan
    /// </summary>
    [JsonProperty("webhookType")]
    public PushPlusWebhookType WebhookType { get; set; }
    /// <summary>
    /// Địa chỉ URL được gọi
    /// </summary>
    [JsonProperty("webhookUrl")]
    public string WebhookUrl { get; set; } = default!;
    /// <summary>
    /// Ngày tạo
    /// </summary>
    [JsonProperty("createTime")]
    public DateTime CreateTime { get; set; }
}
