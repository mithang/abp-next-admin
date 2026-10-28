namespace LINGYUN.Abp.WeChat.Official;

public class AbpWeChatOfficialOptions
{
    /// <summary>
    /// Có phải kiểm thử sandbox hay không
    /// </summary>
    /// <remarks>
    /// Tips: Khi dùng tài khoản kiểm thử, tin nhắn được truyền dưới dạng văn bản thuần, cần bật khi gỡ lỗi
    /// </remarks>
    public bool IsSandBox { get; set; }
    /// <summary>
    /// Url tin nhắn máy chủ của tài khoản chính thức
    /// </summary>
    public string Url { get; set; } = default!;
    /// <summary>
    /// AppId tài khoản chính thức
    /// </summary>
    public string AppId { get; set; } = default!;
    /// <summary>
    /// AppSecret tài khoản chính thức
    /// </summary>
    public string AppSecret { get; set; } = default!;
    /// <summary>
    /// Token giải mã tin nhắn của tài khoản chính thức
    /// </summary>
    public string Token { get; set; } = default!;
    /// <summary>
    /// AESKey giải mã tin nhắn của tài khoản chính thức
    /// </summary>
    public string EncodingAESKey { get; set; } = default!;
}
