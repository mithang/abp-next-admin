using DotNetCore.CAP;
using DotNetCore.CAP.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Volo.Abp.EventBus.Distributed;

namespace LINGYUN.Abp.EventBus.CAP;

/// <summary>
/// Bộ tìm kiếm consumer
/// </summary>
[Dependency(ServiceLifetime.Singleton, ReplaceServices = true)]
[ExposeServices(typeof(IConsumerServiceSelector), typeof(AbpCAPConsumerServiceSelector))]

public class AbpCAPConsumerServiceSelector : ConsumerServiceSelector
{
    /// <summary>
    /// Cấu hình CAP
    /// </summary>
    protected CapOptions CapOptions { get; }
    /// <summary>
    /// Cấu hình sự kiện phân tán Abp
    /// </summary>
    protected AbpDistributedEventBusOptions AbpDistributedEventBusOptions { get; }
    /// <summary>
    /// Nhà cung cấp dịch vụ
    /// </summary>
    protected IServiceProvider ServiceProvider { get; }

    /// <summary>
    /// Creates a new <see cref="T:DotNetCore.CAP.Internal.ConsumerServiceSelector" />.
    /// </summary>
    public AbpCAPConsumerServiceSelector(
        IServiceProvider serviceProvider,
        IOptions<CapOptions> capOptions,
        IOptions<AbpDistributedEventBusOptions> distributedEventBusOptions) : base(serviceProvider)
    {
        CapOptions = capOptions.Value;
        ServiceProvider = serviceProvider;
        AbpDistributedEventBusOptions = distributedEventBusOptions.Value;
    }
    /// <summary>
    /// Tìm tập hợp consumer
    /// </summary>
    /// <param name="provider"></param>
    /// <returns></returns>
    protected override IEnumerable<ConsumerExecutorDescriptor> FindConsumersFromInterfaceTypes(IServiceProvider provider)
    {
        var executorDescriptorList = base.FindConsumersFromInterfaceTypes(provider).ToList();
        //handlers
        var handlers = AbpDistributedEventBusOptions.Handlers;
        var logger = provider.GetRequiredService<ILogger<AbpCAPConsumerServiceSelector>>();
        var consumerExecutorDescriptorComparer = new ConsumerExecutorDescriptorComparer(logger);

        foreach (var handler in handlers)
        {
            var interfaces = handler.GetInterfaces();
            foreach (var @interface in interfaces)
            {
                if (!typeof(IEventHandler).GetTypeInfo().IsAssignableFrom(@interface))
                {
                    continue;
                }
                var genericArgs = @interface.GetGenericArguments();
                if (genericArgs.Length == 1)
                {
                    var consumerExecutorDescriptors = GetHandlerDescription(genericArgs[0], handler);

                    foreach (var consumerExecutorDescriptor in consumerExecutorDescriptors)
                    {
                        if (executorDescriptorList.Any(x => consumerExecutorDescriptorComparer.Equals(x, consumerExecutorDescriptor)))
                        {
                            // Nếu tồn tại nhiều consumer, các consumer tiếp theo cần định nghĩa lại nhóm thì mới không bị framework CAP lọc bỏ
                            var groupAliaName = handler.IsGenericType
                                ? handler.GetGenericTypeDefinition().Name
                                : handler.Name;

                            // TODO: 2021-05-21 Việc dùng trực tiếp tên đầy đủ của kiểu làm GroupName sẽ gây khó hiểu cho người dùng, cần thêm tên nhóm ở phía trước
                            consumerExecutorDescriptor.Attribute.Group = $"{CapOptions.DefaultGroupName}.{groupAliaName}";
                            SetSubscribeAttribute(consumerExecutorDescriptor.Attribute);

                        }
                        executorDescriptorList.Add(consumerExecutorDescriptor);
                    }
                    //Subscribe(genericArgs[0], new IocEventHandlerFactory(ServiceScopeFactory, handler));
                }
            }
        }
        return executorDescriptorList;
    }
    /// <summary>
    /// Lấy tập hợp bộ xử lý sự kiện
    /// </summary>
    /// <param name="eventType"></param>
    /// <param name="typeInfo"></param>
    /// <returns></returns>
    protected virtual IEnumerable<ConsumerExecutorDescriptor> GetHandlerDescription(Type eventType, Type typeInfo)
    {
        var serviceTypeInfo = typeof(IDistributedEventHandler<>)
            .MakeGenericType(eventType);
        var method = typeInfo
            .GetMethod(
                nameof(IDistributedEventHandler<object>.HandleEventAsync),
                new[] { eventType }
            );
        // TODO: Tên sự kiện được định nghĩa trong kiểu tham số sự kiện thì không thể tạo nhiều lớp subscriber, cần thêm cấu hình tuỳ chọn để người dùng quyết định tên sự kiện được định nghĩa ở đâu
        var eventName = EventNameAttribute.GetNameOrDefault(eventType);
        var topicAttr = method!.GetCustomAttributes<TopicAttribute>(true);
        var topicAttributes = topicAttr.ToList();

        topicAttributes.Add(new CapSubscribeAttribute(eventName));

        foreach (var attr in topicAttributes)
        {
            SetSubscribeAttribute(attr);

            var parameters = method!.GetParameters()
                .Select(parameter => new ParameterDescriptor
                {
                    Name = parameter.Name!,
                    ParameterType = parameter.ParameterType,
                    IsFromCap = parameter.GetCustomAttributes(typeof(FromCapAttribute)).Any()
                }).ToList();

            yield return InitDescriptor(attr, method, typeInfo.GetTypeInfo(), serviceTypeInfo.GetTypeInfo(), parameters);
        }
    }

    private static ConsumerExecutorDescriptor InitDescriptor(
        TopicAttribute attr,
        MethodInfo methodInfo,
        TypeInfo implType,
        TypeInfo serviceTypeInfo,
        IList<ParameterDescriptor> parameters)
    {
        var descriptor = new ConsumerExecutorDescriptor
        {
            Attribute = attr,
            MethodInfo = methodInfo,
            ImplTypeInfo = implType,
            ServiceTypeInfo = serviceTypeInfo,
            Parameters = parameters
        };

        return descriptor;
    }
}