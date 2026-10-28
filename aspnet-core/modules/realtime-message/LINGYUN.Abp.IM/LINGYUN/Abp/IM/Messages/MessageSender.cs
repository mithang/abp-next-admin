using LINGYUN.Abp.IdGenerator;
using LINGYUN.Abp.RealTime;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;

namespace LINGYUN.Abp.IM.Messages;

public class MessageSender : IMessageSender, ITransientDependency
{
    protected IDistributedEventBus EventBus { get; }
    protected IDistributedIdGenerator DistributedIdGenerator { get; }
    public MessageSender(
        IDistributedEventBus eventBus,
        IDistributedIdGenerator distributedIdGenerator)
    {
        EventBus = eventBus;
        DistributedIdGenerator = distributedIdGenerator;
    }

    public async virtual Task<string> SendMessageAsync(ChatMessage chatMessage)
    {
        chatMessage.SetProperty(nameof(ChatMessage.IsAnonymous), chatMessage.IsAnonymous);
        chatMessage.MessageId = DistributedIdGenerator.Create().ToString();
        // Nếu lưu trữ trước thì sẽ bị ràng buộc chặt với mô-đun xử lý tin nhắn
        // await Store.StoreMessageAsync(chatMessage);
        var eto = new RealTimeEto<ChatMessage>(chatMessage);

        await EventBus.PublishAsync(eto);

        return chatMessage.MessageId;
    }
}
