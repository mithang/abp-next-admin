namespace LINGYUN.Abp.WeChat.OpenId;

public class WeChatOpenId
{
    /// <summary>
    /// Định danh duy nhất của người dùng trên nền tảng mở, sẽ được trả về khi đáp ứng điều kiện cấp UnionID
    /// </summary>
    public string? UnionId { get; set; }
    /// <summary>
    /// Định danh duy nhất của người dùng
    /// </summary>
    public string OpenId { get; set; } = default!;
    /// <summary>
    /// Khóa phiên
    /// </summary>
    public string SessionKey { get; set; } = default!;

    public WeChatOpenId()
    {

    }

    public WeChatOpenId(string openId, string sessionKey, string? unionId = null)
    {
        OpenId = openId;
        SessionKey = sessionKey;
        UnionId = unionId;
    }
}
