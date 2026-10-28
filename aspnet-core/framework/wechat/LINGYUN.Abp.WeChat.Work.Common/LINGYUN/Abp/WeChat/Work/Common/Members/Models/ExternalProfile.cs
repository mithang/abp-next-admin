using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Thông tin đối ngoại của thành viên
/// </summary>
[System.Text.Json.Serialization.JsonConverter(typeof(ExternalProfileSystemTextJsonConverter))]
[Newtonsoft.Json.JsonConverter(typeof(ExternalProfileNewtonsoftJsonConverter))]
public class ExternalProfile
{
    /// <summary>
    /// Tên viết tắt đối ngoại của doanh nghiệp, cần chọn điền từ các tên viết tắt doanh nghiệp đã được chứng thực. Có thể xem trạng thái chứng thực tên viết tắt doanh nghiệp tại trang "Doanh nghiệp của tôi".
    /// </summary>
    [NotNull]
    [JsonProperty("external_corp_name")]
    [JsonPropertyName("external_corp_name")]
    public string ExternalCorpName {  get; set; } = default!;
    /// <summary>
    /// Thuộc tính kênh video. Phải chọn từ các kênh video mà doanh nghiệp đã liên kết với WeChat doanh nghiệp, có thể xem các kênh video đã liên kết tại trang "Doanh nghiệp của tôi".
    /// Chỉ ứng dụng danh bạ của bên thứ ba mới có thể lấy được; đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ của bên thứ ba cũng không thể lấy được
    /// </summary>
    [NotNull]
    [JsonProperty("wechat_channels")]
    [JsonPropertyName("wechat_channels")]
    public List<WechatChannel> WechatChannels { get; set; } = default!;
    /// <summary>
    /// Danh sách thuộc tính
    /// </summary>
    [NotNull]
    [JsonProperty("external_attr")]
    [JsonPropertyName("external_attr")]
    public List<ExternalAttribute> ExternalAttributes { get; set; } = default!;
}
