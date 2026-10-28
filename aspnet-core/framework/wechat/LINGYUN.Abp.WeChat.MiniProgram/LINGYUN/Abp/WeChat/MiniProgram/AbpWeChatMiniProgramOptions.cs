namespace LINGYUN.Abp.WeChat.MiniProgram;

public class AbpWeChatMiniProgramOptions
{
    /// <summary>
    /// AppId của chương trình mini
    /// </summary>
    public string AppId { get; set; } = default!;
    /// <summary>
    /// AppSecret của chương trình mini
    /// </summary>
    public string AppSecret { get; set; } = default!;
    /// <summary>
    /// Token giải mã tin nhắn của chương trình mini
    /// </summary>
    public string Token { get; set; } = default!;
    /// <summary>
    /// AESKey giải mã tin nhắn của chương trình mini
    /// </summary>
    public string EncodingAESKey { get; set; } = default!;
}
