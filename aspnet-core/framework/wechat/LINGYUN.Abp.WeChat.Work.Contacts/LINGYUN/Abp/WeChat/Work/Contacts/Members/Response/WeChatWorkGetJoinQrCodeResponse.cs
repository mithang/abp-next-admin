using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi lấy mã QR tham gia doanh nghiệp
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91714" />
/// </remarks>
public class WeChatWorkGetJoinQrCodeResponse : WeChatWorkResponse
{
    /// <summary>
    /// Liên kết mã QR, hiệu lực 7 ngày
    /// </summary>
    [NotNull]
    [JsonProperty("join_qrcode")]
    [JsonPropertyName("join_qrcode")]
    public string JoinQrcCode { get; set; } = default!;
}
