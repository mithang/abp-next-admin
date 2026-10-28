using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Security.Models;
public class WeChatIpModel
{
    /// <summary>
    /// Địa chỉ IP
    /// </summary>
    [JsonProperty("ip")]
    [JsonPropertyName("ip")]
    public string Ip { get; set; } = default!;
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
    /// Có bắt buộc hay không, 0 - không, 1 - có, nếu tên miền hoặc IP bắt buộc bị chặn sẽ khiến chức năng của WeChat doanh nghiệp gặp bất thường
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
