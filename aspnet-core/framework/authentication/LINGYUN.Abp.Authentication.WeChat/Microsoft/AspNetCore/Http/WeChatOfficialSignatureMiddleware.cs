using LINGYUN.Abp.WeChat.Official;
using System;
using System.Collections;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace Microsoft.AspNetCore.Http
{
    public class WeChatOfficialSignatureMiddleware : IMiddleware, ITransientDependency
    {
        protected AbpWeChatOfficialOptionsFactory WeChatOfficialOptionsFactory { get; }
        public WeChatOfficialSignatureMiddleware(
            AbpWeChatOfficialOptionsFactory weChatOfficialOptionsFactory)
        {
            WeChatOfficialOptionsFactory = weChatOfficialOptionsFactory;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (context.Request.Path.HasValue)
            {
                var options = await WeChatOfficialOptionsFactory.CreateAsync();

                var requestPath = context.Request.Path.Value;
                // Kiểm tra địa chỉ truy cập có khớp với địa chỉ đã định nghĩa không
                if (requestPath.Equals(options.Url))
                {
                    var timestamp = context.Request.Query["timestamp"];
                    var nonce = context.Request.Query["nonce"];
                    var signature = context.Request.Query["signature"];
                    var echostr = context.Request.Query["echostr"];
                    // Xác thực tính hợp lệ của thông điệp
                    var check = CheckWeChatSignature(options.Token, timestamp, nonce, signature);
                    if (check)
                    {
                        // Sau khi xác thực thành công cần trả lại nguyên vẹn các ký tự mà máy chủ WeChat đã truyền tới
                        await context.Response.WriteAsync(echostr);
                        return;
                    }
                    // Xác thực thông điệp WeChat không thành công
                    throw new AbpException("Invalid wechat signature");
                }
            }
            // Thông điệp không thuộc về WeChat sẽ đi vào middleware tiếp theo
            await next(context);
        }

        protected bool CheckWeChatSignature(string token, string timestamp, string nonce, string signature)
        {
            var al = new ArrayList
            {
                token,
                timestamp,
                nonce
            };
            // bước 1: sắp xếp
            al.Sort();
            string signatureStr = string.Empty;
            // bước 2: nối chuỗi
            for (int i = 0; i < al.Count; i++)
            {
                signatureStr += al[i];
            }
            // bước 3: mã hoá SHA1
            byte[] bytes_out = signatureStr.Sha1();
            string result = BitConverter.ToString(bytes_out).Replace("-", "");
            // bước 4: so sánh
            if (result.Equals(signature, StringComparison.CurrentCultureIgnoreCase))
            {
                return true;
            }
            return false;
        }
    }
}
