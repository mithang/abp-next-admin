using Microsoft.AspNetCore.Http;

namespace Microsoft.AspNetCore.Builder
{
    public static class IdentityServerApplicationBuilderExtensions
    {
        /// <summary>
        /// Bật middleware để có thể xử lý tin nhắn từ máy chủ WeChat
        /// Dùng để xác minh tin nhắn có đến từ máy chủ WeChat hay không
        /// </summary>
        /// <param name="builder"></param>
        /// <remarks>
        /// Cũng có thể triển khai dưới dạng Controller
        /// </remarks>
        /// <returns></returns>
        public static IApplicationBuilder UseWeChatSignature(this IApplicationBuilder builder)
        {
            builder.UseMiddleware<WeChatOfficialSignatureMiddleware>();
            return builder;
        }
    }
}
