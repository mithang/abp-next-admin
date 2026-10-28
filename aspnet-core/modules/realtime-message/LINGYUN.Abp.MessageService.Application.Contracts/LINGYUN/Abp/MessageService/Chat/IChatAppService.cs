using LINGYUN.Abp.IM.Messages;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.MessageService.Chat;

public interface IChatAppService : IApplicationService
{
    /// <summary>
    /// Gửi tin nhắn
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<ChatMessageSendResultDto> SendMessageAsync(ChatMessage input);
    /// <summary>
    /// Lấy tin nhắn nhóm
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<ChatMessage>> GetMyGroupMessageAsync(GroupMessageGetByPagedDto input);
    /// <summary>
    /// Lấy tin nhắn của tôi
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<ChatMessage>> GetMyChatMessageAsync(UserMessageGetByPagedDto input);
    /// <summary>
    /// Lấy tin nhắn gần đây của tôi
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<ListResultDto<LastChatMessage>> GetMyLastChatMessageAsync(GetUserLastMessageDto input);
    //TOTO: Còn nên có chức năng lấy tin nhắn chưa đọc của tôi và tin nhắn nhóm chưa đọc của tôi
}
