using LINGYUN.Abp.WeChat.Work.Chat.Request;
using LINGYUN.Abp.WeChat.Work.Chat.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Chat;
/// <summary>
/// Giao diện thao tác trò chuyện nhóm
/// </summary>
/// <remarks>
/// Tham khảo: https://developer.work.weixin.qq.com/document/path/90244
/// </remarks>
public interface IWeChatWorkAppChatManager
{
    /// <summary>
    /// Tạo phiên trò chuyện nhóm
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/90245
    /// </remarks>
    Task<WeChatWorkAppChatCreateResponse> CreateAsync(
        WeChatWorkAppChatCreateRequest request, 
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Sửa phiên trò chuyện nhóm
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/98913
    /// </remarks>
    Task<WeChatWorkResponse> UpdateAsync(
        WeChatWorkAppChatUpdateRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy phiên trò chuyện nhóm
    /// </summary>
    /// <remarks>
    /// Tham khảo: https://developer.work.weixin.qq.com/document/path/98914
    /// </remarks>
    Task<WeChatWorkAppChatInfoResponse> GetAsync(
        string agentId,
        string chatId,
        CancellationToken cancellationToken = default);
}
