using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Authorize.Response;
/// <summary>
/// Phản hồi kiểm tra chứng thực đăng nhập tạm thời của WeChat Work
/// </summary>
[Serializable]
public class WeChatWorkCode2SessionResponse : WeChatWorkResponse
{
    /// <summary>
    /// Corpid của doanh nghiệp mà người dùng thuộc về
    /// </summary>
    [NotNull]
    [JsonProperty("corpid")]
    [JsonPropertyName("corpid")]
    public string CorpId { get; set; } = default!;
    /// <summary>
    /// UserID của người dùng trong doanh nghiệp, tương ứng với tài khoản của phía quản trị, duy nhất trong doanh nghiệp. Lưu ý: tại đây, ứng dụng nhỏ bên thứ ba trả về userid đã mã hóa
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Khóa phiên
    /// </summary>
    [NotNull]
    [JsonProperty("session_key")]
    [JsonPropertyName("session_key")]
    public string SessionKey { get; set; } = default!;
    [CanBeNull]
    [JsonProperty("deviceid")]
    [JsonPropertyName("deviceid")]
    public string? DeviceId { get; set; } = default!;
}
