using LINGYUN.Abp.WeChat.Common;
using Newtonsoft.Json;

namespace LINGYUN.Abp.WeChat.Token;

/// <summary>
/// Đối tượng trả về mã truy cập WeChat
/// </summary>
public class WeChatTokenResponse
{
    /// <summary>
    /// Mã lỗi
    /// </summary>
    [JsonProperty("errcode")]
    public int ErrorCode { get; set; } = default!;
    /// <summary>
    /// Tin nhắn lỗi
    /// </summary>
    [JsonProperty("errmsg")]
    public string? ErrorMessage { get; set; }
    /// <summary>
    /// Mã truy cập
    /// </summary>
    [JsonProperty("access_token")]
    public string AccessToken { get; set; } = default!;
    /// <summary>
    /// Thời gian hết hạn, đơn vị (s)
    /// </summary>
    [JsonProperty("expires_in")]
    public int ExpiresIn { get; set; }

    public WeChatToken ToWeChatToken()
    {
        if(ErrorCode != 0)
        {
            throw new AbpWeChatException(ErrorCode.ToString(), ErrorMessage!);
        }
        return new WeChatToken(AccessToken, ExpiresIn);
    }
}
