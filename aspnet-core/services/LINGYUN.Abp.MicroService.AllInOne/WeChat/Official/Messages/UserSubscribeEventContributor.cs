using LINGYUN.Abp.WeChat.Common.Messages.Handlers;
using LINGYUN.Abp.WeChat.Official.Messages.Models;
using LINGYUN.Abp.WeChat.Official.Services;

namespace LINGYUN.Abp.MicroService.AllInOne.WeChat.Official.Messages;
/// <summary>
/// Tin nhắn trả lời khi người dùng theo dõi
/// </summary>
public class UserSubscribeEventContributor : IEventHandleContributor<UserSubscribeEvent>
{
    public async virtual Task HandleAsync(MessageHandleContext<UserSubscribeEvent> context)
    {
        var messageSender = context.ServiceProvider.GetRequiredService<IServiceCenterMessageSender>();

        await messageSender.SendAsync(
            new LINGYUN.Abp.WeChat.Official.Services.Models.TextMessageModel(
                context.Message.FromUserName,
                new LINGYUN.Abp.WeChat.Official.Services.Models.TextMessage(
                    "Cảm ơn bạn đã theo dõi, nhấn vào menu để tìm hiểu thêm.")));
    }
}
