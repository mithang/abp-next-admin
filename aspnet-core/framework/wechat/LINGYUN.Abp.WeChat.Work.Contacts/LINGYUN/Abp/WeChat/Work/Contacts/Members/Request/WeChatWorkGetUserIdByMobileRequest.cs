using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu lấy userid bằng số điện thoại di động
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95402" />
/// </remarks>
public class WeChatWorkGetUserIdByMobileRequest : WeChatWorkRequest
{
    /// <summary>
    /// Số điện thoại di động của người dùng trong danh bạ WeChat Doanh nghiệp. Độ dài 5~32 byte
    /// </summary>
    [NotNull]
    [JsonProperty("mobile")]
    [JsonPropertyName("mobile")]
    public string Mobile { get; }
    public WeChatWorkGetUserIdByMobileRequest(string mobile)
    {
        Mobile = Check.NotNullOrWhiteSpace(mobile, nameof(mobile), 32, 5);
    }
}
