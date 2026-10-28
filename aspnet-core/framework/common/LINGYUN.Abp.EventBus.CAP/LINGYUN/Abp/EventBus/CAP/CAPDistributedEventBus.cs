using DotNetCore.CAP;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Clients;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Guids;
using Volo.Abp.Json;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Tracing;
using Volo.Abp.Uow;
using Volo.Abp.Users;

namespace LINGYUN.Abp.EventBus.CAP;

/// <summary>
/// Bus sự kiện phân tán CAP
/// </summary>
[Dependency(ServiceLifetime.Singleton, ReplaceServices = true)]
[ExposeServices(typeof(IDistributedEventBus), typeof(CAPDistributedEventBus))]
public class CAPDistributedEventBus : DistributedEventBusBase, IDistributedEventBus
{
    /// <summary>
    /// Interface phát hành tin nhắn CAP
    /// </summary>
    protected ICapPublisher CapPublisher { get; }
    /// <summary>
    /// Interface đăng ký sự kiện tùy chỉnh
    /// </summary>
    protected ICustomDistributedEventSubscriber CustomDistributedEventSubscriber { get; }
    /// <summary>
    /// Tập hợp đối tượng factory bộ xử lý sự kiện cục bộ
    /// </summary>
    protected ConcurrentDictionary<Type, List<IEventHandlerFactory>> HandlerFactories { get; }
    /// <summary>
    /// Tập hợp đối tượng factory bộ xử lý sự kiện động cục bộ
    /// </summary>
    protected ConcurrentDictionary<string, List<IEventHandlerFactory>> DynamicHandlerFactories { get; }
    /// <summary>
    /// Tập hợp sự kiện cục bộ
    /// </summary>
    protected ConcurrentDictionary<string, Type> EventTypes { get; }
    /// <summary>
    /// Người dùng hiện tại
    /// </summary>
    protected ICurrentUser CurrentUser { get; }
    /// <summary>
    /// Máy khách hiện tại
    /// </summary>
    protected ICurrentClient CurrentClient { get; }
    /// <summary>
    /// typeof <see cref="IJsonSerializer"/>
    /// </summary>
    protected IJsonSerializer JsonSerializer { get; }
    /// <summary>
    /// Token hủy
    /// </summary>
    protected ICancellationTokenProvider CancellationTokenProvider { get; }
    /// <summary>
    /// constructor
    /// </summary>
    /// <param name="serviceScopeFactory"></param>
    /// <param name="distributedEventBusOptions"></param>
    /// <param name="capPublisher"></param>
    /// <param name="currentUser"></param>
    /// <param name="currentClient"></param>
    /// <param name="currentTenant"></param>
    /// <param name="jsonSerializer"></param>
    /// <param name="unitOfWorkManager"></param>
    /// <param name="cancellationTokenProvider"></param>
    /// <param name="guidGenerator"></param>
    /// <param name="clock"></param>
    /// <param name="customDistributedEventSubscriber"></param>
    /// <param name="eventHandlerInvoker"></param>
    /// <param name="localEventBus"></param>
    /// <param name="correlationIdProvider"></param>
    public CAPDistributedEventBus(IServiceScopeFactory serviceScopeFactory,
        IOptions<AbpDistributedEventBusOptions> distributedEventBusOptions,
        ICapPublisher capPublisher,
        ICurrentUser currentUser,
        ICurrentClient currentClient,
        ICurrentTenant currentTenant,
        IJsonSerializer jsonSerializer,
        IUnitOfWorkManager unitOfWorkManager,
        IGuidGenerator guidGenerator,
        IClock clock,
        ICancellationTokenProvider cancellationTokenProvider,
        ICustomDistributedEventSubscriber customDistributedEventSubscriber,
        IEventHandlerInvoker eventHandlerInvoker,
        ILocalEventBus localEventBus,
        ICorrelationIdProvider correlationIdProvider) 
        : base(
              serviceScopeFactory, 
              currentTenant,
              unitOfWorkManager, 
              distributedEventBusOptions,
              guidGenerator,
              clock,
              eventHandlerInvoker,
              localEventBus,
              correlationIdProvider)
    {
        CapPublisher = capPublisher;
        CurrentUser = currentUser;
        CurrentClient = currentClient;
        JsonSerializer = jsonSerializer;
        CancellationTokenProvider = cancellationTokenProvider;
        CustomDistributedEventSubscriber = customDistributedEventSubscriber;
        DynamicHandlerFactories = new ConcurrentDictionary<string, List<IEventHandlerFactory>>();
        HandlerFactories = new ConcurrentDictionary<Type, List<IEventHandlerFactory>>();
        EventTypes = new ConcurrentDictionary<string, Type>();
    }
    /// <summary>
    /// Đăng ký sự kiện
    /// </summary>
    /// <param name="eventType"></param>
    /// <param name="factory"></param>
    /// <returns></returns>
    public override IDisposable Subscribe(Type eventType, IEventHandlerFactory factory)
    {
        return NullDisposable.Instance;
    }
    /// <summary>
    /// Hủy đăng ký sự kiện
    /// </summary>
    /// <typeparam name="TEvent">Loại sự kiện</typeparam>
    /// <param name="action"></param>
    public override void Unsubscribe<TEvent>(Func<TEvent, Task> action)
    {
    }
    /// <summary>
    /// Hủy đăng ký sự kiện
    /// </summary>
    /// <param name="eventType">Loại sự kiện</param>
    /// <param name="handler">Bộ xử lý sự kiện</param>
    public override void Unsubscribe(Type eventType, IEventHandler handler)
    {
    }
    /// <summary>
    /// Hủy đăng ký sự kiện
    /// </summary>
    /// <param name="eventType">Loại sự kiện</param>
    /// <param name="factory">Factory bộ xử lý sự kiện</param>
    public override void Unsubscribe(Type eventType, IEventHandlerFactory factory)
    {
    }
    /// <summary>
    /// Hủy đăng ký tất cả sự kiện
    /// </summary>
    /// <param name="eventType">Loại sự kiện</param>
    public override void UnsubscribeAll(Type eventType)
    {
    }
    /// <summary>
    /// Phát hành sự kiện
    /// </summary>
    /// <param name="eventType">Loại sự kiện</param>
    /// <param name="eventData">Đối tượng dữ liệu sự kiện</param>
    /// <returns></returns>
    protected override async Task PublishToEventBusAsync(Type eventType, object eventData)
    {
        await PublishToCapAsync(eventType, eventData, messageId: null, correlationId: CorrelationIdProvider.Get());
    }

    /// <summary>
    /// Lấy danh sách factory bộ xử lý sự kiện
    /// </summary>
    /// <param name="eventType"></param>
    /// <returns></returns>
    protected override IEnumerable<EventTypeWithEventHandlerFactories> GetHandlerFactories(Type eventType)
    {
        var handlerFactoryList = new List<EventTypeWithEventHandlerFactories>();
        var eventNames = EventTypes.Where(x => ShouldTriggerEventForHandler(eventType, x.Value)).Select(x => x.Key).ToList();

        foreach (var handlerFactory in HandlerFactories.Where(hf => ShouldTriggerEventForHandler(eventType, hf.Key)))
        {
            handlerFactoryList.Add(new EventTypeWithEventHandlerFactories(handlerFactory.Key, handlerFactory.Value));
        }

        foreach (var handlerFactory in DynamicHandlerFactories.Where(aehf => eventNames.Contains(aehf.Key)))
        {
            handlerFactoryList.Add(new EventTypeWithEventHandlerFactories(typeof(DynamicEventData), handlerFactory.Value));
        }

        return handlerFactoryList.ToArray();
    }

    protected override Type? GetEventTypeByEventName(string eventName)
    {
        return EventTypes.GetOrDefault(eventName);
    }

    protected override byte[] Serialize(object eventData)
    {
        var eventJson = JsonSerializer.Serialize(eventData);

        return Encoding.UTF8.GetBytes(eventJson);
    }

    protected override void AddToUnitOfWork(IUnitOfWork unitOfWork, UnitOfWorkEventRecord eventRecord)
    {
        unitOfWork.AddOrReplaceDistributedEvent(eventRecord);
    }

    public override async Task PublishFromOutboxAsync(OutgoingEventInfo outgoingEvent, OutboxConfig outboxConfig)
    {
        await PublishToCapAsync(outgoingEvent.EventName, outgoingEvent.EventData, outgoingEvent.Id, outgoingEvent.GetCorrelationId());

        using (CorrelationIdProvider.Change(outgoingEvent.GetCorrelationId()))
        {
            await TriggerDistributedEventSentAsync(new DistributedEventSent()
            {
                Source = DistributedEventSource.Outbox,
                EventName = outgoingEvent.EventName,
                EventData = outgoingEvent.EventData
            });
        }
    }

    public async override Task PublishManyFromOutboxAsync(IEnumerable<OutgoingEventInfo> outgoingEvents, OutboxConfig outboxConfig)
    {
        foreach (var outgoingEvent in outgoingEvents)
        {
            await PublishFromOutboxAsync(outgoingEvent, outboxConfig);
        }
    }

    public override async Task ProcessFromInboxAsync(IncomingEventInfo incomingEvent, InboxConfig inboxConfig)
    {
        var eventJson = Encoding.UTF8.GetString(incomingEvent.EventData);
        var eventType = EventTypes.GetOrDefault(incomingEvent.EventName);
        object eventData;
        if (eventType != null)
        {
            eventData = JsonSerializer.Deserialize(eventType, eventJson);
        }
        else if (DynamicHandlerFactories.ContainsKey(incomingEvent.EventName))
        {
            eventData = new DynamicEventData(incomingEvent.EventName, JsonSerializer.Deserialize<object>(eventJson));
            eventType = typeof(DynamicEventData);
        }
        else
        {
            return;
        }
        var exceptions = new List<Exception>();
        using (CorrelationIdProvider.Change(incomingEvent.GetCorrelationId()))
        {
            await TriggerHandlersFromInboxAsync(eventType, eventData, exceptions, inboxConfig);
        }
        if (exceptions.Any())
        {
            ThrowOriginalExceptions(eventType, exceptions);
        }
    }

    protected virtual async Task PublishToCapAsync(Type eventType, object eventData, Guid? messageId, string? correlationId = null)
    {
        var (eventName, resolvedData) = ResolveEventForPublishing(eventType, eventData);
        await PublishToCapAsync(eventName, resolvedData, null, correlationId);
    }

    protected virtual async Task PublishToCapAsync(string eventName, object eventData, Guid? messageId, string? correlationId = null)
    {
        var headers = new Dictionary<string, string?>();
        if (messageId.HasValue)
        {
            headers.TryAdd(AbpCAPHeaders.MessageId, messageId.ToString());
        }
        if (CurrentUser.Id.HasValue)
        {
            headers.TryAdd(AbpCAPHeaders.UserId, CurrentUser.Id.ToString());
        }
        if (CurrentTenant.Id.HasValue)
        {
            headers.TryAdd(AbpCAPHeaders.TenantId, CurrentTenant.Id.ToString());
        }
        if (!CurrentClient.Id.IsNullOrWhiteSpace())
        {
            headers.TryAdd(AbpCAPHeaders.ClientId, CurrentClient.Id);
        }
        if (!correlationId.IsNullOrWhiteSpace())
        {
            headers.TryAdd(AbpCAPHeaders.CorrelationId, correlationId);
        }

        await CapPublisher.PublishAsync(eventName, eventData, headers, CancellationTokenProvider.FallbackToProvider());
    }

    public override IDisposable Subscribe(string eventName, IEventHandlerFactory handler)
    {
        return NullDisposable.Instance;
    }

    public override void Unsubscribe(string eventName, IEventHandlerFactory factory)
    {

    }

    public override void Unsubscribe(string eventName, IEventHandler handler)
    {

    }

    public override void UnsubscribeAll(string eventName)
    {

    }

    public override Task PublishAsync(string eventName, object eventData, bool onUnitOfWorkComplete = true)
    {
        var eventType = EventTypes.GetOrDefault(eventName);
        var dynamicEventData = eventData as DynamicEventData ?? new DynamicEventData(eventName, eventData);

        if (eventType != null)
        {
            return PublishAsync(eventType, ConvertDynamicEventData(dynamicEventData.Data, eventType), onUnitOfWorkComplete);
        }

        return PublishAsync(typeof(DynamicEventData), dynamicEventData, onUnitOfWorkComplete);
    }

    protected override IEnumerable<EventTypeWithEventHandlerFactories> GetDynamicHandlerFactories(string eventName)
    {
        var result = new List<EventTypeWithEventHandlerFactories>();

        var eventType = GetEventTypeByEventName(eventName);
        if (eventType != null)
        {
            return GetHandlerFactories(eventType);
        }

        foreach (var handlerFactory in DynamicHandlerFactories.Where(hf => hf.Key == eventName))
        {
            result.Add(new EventTypeWithEventHandlerFactories(typeof(DynamicEventData), handlerFactory.Value));
        }

        return result;
    }

    private static bool ShouldTriggerEventForHandler(Type targetEventType, Type handlerEventType)
    {
        //Should trigger same type
        if (handlerEventType == targetEventType)
        {
            return true;
        }

        //TODO: Support inheritance? But it does not support on subscription to RabbitMq!
        //Should trigger for inherited types
        if (handlerEventType.IsAssignableFrom(targetEventType))
        {
            return true;
        }

        return false;
    }
}
