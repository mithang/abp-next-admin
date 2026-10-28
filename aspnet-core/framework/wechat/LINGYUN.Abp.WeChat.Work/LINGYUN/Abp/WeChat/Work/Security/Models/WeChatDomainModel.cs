using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Security.Models;
public class WeChatDomainModel
{
    /// <summary>
    /// Tên miền
    /// </summary>
    [JsonProperty("domain")]
    [JsonPropertyName("domain")]
    public string Domain { get; set; } = default!;
    /// <summary>
    /// Tên miền wildcard
    /// </summary>
    [JsonProperty("universal_domian")]
    [JsonPropertyName("universal_domian")]
    public string? UniversalDomian { get; set; }
    /// <summary>
    /// Giao thức, ví dụ TCP, UDP
    /// </summary>
    [JsonProperty("protocol")]
    [JsonPropertyName("protocol")]
    public string Protocol { get; set; } = default!;
    /// <summary>
    /// Danh sách số cổng
    /// </summary>
    [JsonProperty("port")]
    [JsonPropertyName("port")]
    public List<int> Port { get; set; } = new List<int>();
    /// <summary>
    /// Có bắt buộc hay không, 0 - không, 1 - có; nếu tên miền hoặc IP bắt buộc bị chặn, chức năng của WeChat doanh nghiệp sẽ gặp bất thường
    /// </summary>
    [JsonProperty("is_necessary")]
    [JsonPropertyName("is_necessary")]
    public int IsNecessary { get; set; } = default!;
    /// <summary>
    /// Thông tin mô tả chức năng liên quan đến IP
    /// </summary>
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
}
