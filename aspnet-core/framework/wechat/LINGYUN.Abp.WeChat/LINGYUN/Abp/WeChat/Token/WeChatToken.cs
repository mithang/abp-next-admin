namespace LINGYUN.Abp.WeChat.Token;

/// <summary>
/// Mã thông báo WeChat
/// </summary>
public class WeChatToken
{
    /// <summary>
    /// Mã truy cập
    /// </summary>
    public string AccessToken { get; set; } = default!;
    /// <summary>
    /// Thời gian hết hạn, đơn vị (s)
    /// </summary>
    public int ExpiresIn { get; set; }
    public WeChatToken()
    {

    }
    public WeChatToken(string token, int expiresIn)
    {
        AccessToken = token;
        ExpiresIn = expiresIn;
    }
}
