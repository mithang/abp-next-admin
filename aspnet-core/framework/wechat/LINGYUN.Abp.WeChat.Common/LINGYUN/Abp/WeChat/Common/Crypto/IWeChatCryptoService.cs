using LINGYUN.Abp.WeChat.Common.Crypto.Models;

namespace LINGYUN.Abp.WeChat.Common.Crypto;

public interface IWeChatCryptoService
{
    /// <summary>
    /// Kiểm tra
    /// </summary>
    /// <param name="data"></param>
    /// <param name="sReplyEchoStr"></param>
    /// <returns></returns>
    string Validation(WeChatCryptoEchoData data);
    /// <summary>
    /// Giải mã
    /// </summary>
    /// <param name="data"></param>
    /// <param name="sMsg"></param>
    /// <returns></returns>
    string Decrypt(WeChatCryptoDecryptData data);
    /// <summary>
    /// Mã hóa
    /// </summary>
    /// <param name="data"></param>
    /// <param name="sEncryptMsg"></param>
    /// <returns></returns>
    string Encrypt(WeChatCryptoEncryptData data);
}
