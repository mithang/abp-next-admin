using System;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.EventBus.CAP;

/// <summary>
/// Người đăng ký sự kiện tùy chỉnh
/// </summary>
public  interface ICustomDistributedEventSubscriber
{
    /// <summary>
    /// Đăng ký sự kiện
    /// </summary>
    /// <param name="eventType"></param>
    /// <param name="factory"></param>
    void Subscribe(Type eventType, IEventHandlerFactory factory);
    /// <summary>
    /// Hủy đăng ký
    /// </summary>
    /// <param name="eventType"></param>
    /// <param name="factory"></param>
    void UnSubscribe(Type eventType, IEventHandlerFactory factory);
}
