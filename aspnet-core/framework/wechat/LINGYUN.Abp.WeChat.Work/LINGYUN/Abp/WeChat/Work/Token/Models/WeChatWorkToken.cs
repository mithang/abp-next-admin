namespace LINGYUN.Abp.WeChat.Work.Token.Models;

/// <summary>
/// Token WeChat Doanh nghiệp
/// </summary>
public class WeChatWorkToken
{
    /// <summary>
    /// Token truy cập
    /// </summary>
    public string AccessToken { get; set; } = default!;
    /// <summary>
    /// Thời gian hết hạn, đơn vị (s)
    /// </summary>
    public int ExpiresIn { get; set; }
    public WeChatWorkToken()
    {

    }
    public WeChatWorkToken(string token, int expiresIn)
    {
        AccessToken = token;
        ExpiresIn = expiresIn;
    }
}
