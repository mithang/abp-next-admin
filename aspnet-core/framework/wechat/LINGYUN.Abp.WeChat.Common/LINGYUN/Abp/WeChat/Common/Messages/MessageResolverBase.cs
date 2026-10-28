using LINGYUN.Abp.WeChat.Common.Crypto;
using LINGYUN.Abp.WeChat.Common.Crypto.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.WeChat.Common.Messages;
public abstract class MessageResolverBase : ITransientDependency
{
    private readonly IWeChatCryptoService _cryptoService;
    private readonly IServiceProvider _serviceProvider;

    protected MessageResolverBase(
        IWeChatCryptoService cryptoService,
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _cryptoService = cryptoService;
    }
    /// <summary>
    /// Phân giải tin nhắn/sự kiện do máy chủ WeChat đẩy tới
    /// </summary>
    /// <param name="messageData"></param>
    /// <returns></returns>
    public async virtual Task<MessageResolveResult> ResolveAsync(MessageResolveData messageData)
    {
        using (var serviceScope = _serviceProvider.CreateScope())
        {
            /* Định dạng dữ liệu dạng văn bản thuần
             * <xml>
             *  <ToUserName><![CDATA[toUser]]></ToUserName>
                <FromUserName><![CDATA[fromUserName]]></FromUserName>
                <CreateTime>1699433172</CreateTime>
                <MsgType><![CDATA[event]]></MsgType>
                <Event><![CDATA[event]]></Event>
                <EventKey><![CDATA[eventKey]]></EventKey>
                <Ticket><![CDATA[gQH97zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyTVoyOTBoLVJka0YxazFiYnhCMXcAAgTFSktlAwQ8AAAA]]></Ticket>
               </xml>
             */
            var xmlDocument = XDocument.Parse(messageData.Data);
            if (!xmlDocument.Elements("Encrypt").Any())
            {
                /* Định dạng dữ liệu đã mã hóa
                 * <xml>
                 *  <ToUserName><![CDATA[toUser]]></ToUserName>
                    <Encrypt><![CDATA[msg_encrypt]]></Encrypt>
                   </xml>
                 */
                var cryptoDecryptData = new WeChatCryptoDecryptData(
                    messageData.Data,
                    messageData.AppId,
                    messageData.Token,
                    messageData.EncodingAESKey,
                    messageData.Signature,
                    messageData.TimeStamp.ToString(),
                    messageData.Nonce);
                // Sau khi qua hàm giải mã sẽ thu được dữ liệu thực như trên
                var decryptMessage = _cryptoService.Decrypt(cryptoDecryptData);
                xmlDocument = XDocument.Parse(decryptMessage);

                var context = new MessageResolveContext(decryptMessage, xmlDocument, serviceScope.ServiceProvider);
                return await ResolveMessageAsync(context);
            }
            else
            {
                var context = new MessageResolveContext(messageData.Data, xmlDocument, serviceScope.ServiceProvider);
                return await ResolveMessageAsync(context);
            }
        }
    }
    /// <summary>
    /// Triển khai phương thức cụ thể để phân giải tin nhắn/sự kiện do máy chủ WeChat đẩy tới
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    protected abstract Task<MessageResolveResult> ResolveMessageAsync(MessageResolveContext context);
}
