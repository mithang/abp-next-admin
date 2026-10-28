using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Trình phân tích dữ liệu kênh thông báo (payload)
/// </summary>
public class NotificationChannelDataResolver : INotificationChannelDataResolver, ISingletonDependency
{
    protected IServiceProvider ServiceProvider { get; }
    protected INotificationChannelDataAccessor Accessor { get; }
    protected INotificationChannelDataPresenceProvider PresenceProvider { get; }
    protected ILogger<NotificationChannelDataResolver> Logger { get; }

    private readonly IOptions<AbpNotificationChannelDataOptions> _options;
    private readonly Dictionary<string, List<ChannelDataRegistration>> _registrations;
    private readonly Dictionary<Type, ChannelDataRegistration> _registrationsByType;
    private readonly object _syncLock = new();

    public NotificationChannelDataResolver(
        IServiceProvider serviceProvider,
        IOptions<AbpNotificationChannelDataOptions> options,
        INotificationChannelDataAccessor accessor,
        INotificationChannelDataPresenceProvider presenceProvider,
        ILogger<NotificationChannelDataResolver>? logger = null)
    {
        ServiceProvider = serviceProvider;
        _options = options;
        Accessor = accessor;
        PresenceProvider = presenceProvider;
        Logger = logger ?? NullLogger<NotificationChannelDataResolver>.Instance;
        _registrations = new Dictionary<string, List<ChannelDataRegistration>>(StringComparer.OrdinalIgnoreCase);
        _registrationsByType = new Dictionary<Type, ChannelDataRegistration>();
    }

    public virtual IReadOnlyList<NotificationChannelData> Resolve(string providerName, NotificationData notificationData)
    {
        Check.NotNull(providerName, nameof(providerName));
        Check.NotNull(notificationData, nameof(notificationData));

        var result = new List<NotificationChannelData>();

        foreach (var registration in GetRegistrations(providerName))
        {
            if (!registration.IsPresent(notificationData))
            {
                continue;
            }

            var channelData = CreateChannelData(registration, notificationData);
            if (channelData != null)
            {
                result.Add(channelData);
            }
        }

        return result;
    }

    public virtual TChannelData? Resolve<TChannelData>(NotificationData notificationData)
        where TChannelData : NotificationChannelData
    {
        return Resolve(typeof(TChannelData), notificationData) as TChannelData;
    }

    public virtual NotificationChannelData? Resolve(Type payloadType, NotificationData notificationData)
    {
        Check.NotNull(payloadType, nameof(payloadType));
        Check.NotNull(notificationData, nameof(notificationData));

        var registration = GetRegistration(payloadType);

        return registration.IsPresent(notificationData)
            ? CreateChannelData(registration, notificationData)
            : null;
    }

    public virtual bool IsDeclared(NotificationData notificationData, Type payloadType)
    {
        Check.NotNull(notificationData, nameof(notificationData));
        Check.NotNull(payloadType, nameof(payloadType));

        return GetRegistration(payloadType).IsPresent(notificationData);
    }

    public virtual IReadOnlyList<Type> GetPayloadTypes(string providerName)
    {
        return GetRegistrations(providerName)
            .Select(x => x.Descriptor.PayloadType)
            .ToArray();
    }

    public virtual string? GetKey(NotificationData notificationData, Type payloadType)
    {
        Check.NotNull(payloadType, nameof(payloadType));

        // Trả về khóa định danh payload thực tế khớp trong dữ liệu (chữ hoa/thường có thể khác với khai báo), dùng cho thông tin chẩn đoán
        foreach (var key in PresenceProvider.GetMatchingKeys(payloadType))
        {
            if (Accessor.TryGetRawValue(notificationData, key, out _, out var matchedKey))
            {
                return matchedKey ?? key;
            }
        }

        // Khi không tồn tại trong dữ liệu thì trả về khóa định danh đã khai báo
        return PresenceProvider.GetMatchingKeys(payloadType).FirstOrDefault();
    }

    public virtual object? Get(NotificationData notificationData, string key, Type targetType)
    {
        return Accessor.Get(notificationData, key, targetType);
    }

    public virtual TValue? GetValue<TValue>(NotificationData notificationData, string key)
        where TValue : struct
    {
        return Accessor.GetValue<TValue>(notificationData, key);
    }

    public virtual TValue GetValue<TValue>(NotificationData notificationData, string key, TValue defaultValue)
        where TValue : struct
    {
        return Accessor.GetValue(notificationData, key, defaultValue);
    }

    public virtual string? GetOrNull(NotificationData notificationData, params string[] keys)
    {
        return Accessor.GetOrNull(notificationData, keys);
    }

    protected virtual ChannelDataRegistration GetRegistration(Type payloadType)
    {
        if (_registrationsByType.TryGetValue(payloadType, out var registration))
        {
            return registration;
        }

        // Các kiểu chưa đăng ký được đọc trực tiếp theo quy ước, tránh việc producer và kênh bị phụ thuộc vào thứ tự đăng ký
        return new ChannelDataRegistration(
            new NotificationChannelDataDescriptor(
                string.Empty,
                payloadType,
                0,
                PresenceProvider.GetPresenceMode(payloadType),
                PresenceProvider.Create(payloadType)),
            serviceProvider => ActivatorUtilities.CreateInstance(serviceProvider, payloadType));
    }

    protected virtual NotificationChannelData? CreateChannelData(
        ChannelDataRegistration registration,
        NotificationData notificationData)
    {
        object? instance;
        try
        {
            instance = registration.Factory(ServiceProvider);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex,
                "Failed to create the channel data '{ChannelData}' for provider '{Provider}'.",
                registration.Descriptor.PayloadType.FullName, registration.Descriptor.ProviderName);
            return null;
        }

        if (instance is not NotificationChannelData channelData)
        {
            Logger.LogError(
                "The channel data '{ChannelData}' for provider '{Provider}' is not assignable to '{BaseType}'.",
                registration.Descriptor.PayloadType.FullName, registration.Descriptor.ProviderName, typeof(NotificationChannelData).FullName);
            return null;
        }

        foreach (var property in NotificationChannelDataPropertyCache.GetProperties(registration.Descriptor.PayloadType))
        {
            // Xác định tên khóa thực tế theo cách không phân biệt chữ hoa/thường, tương thích với dữ liệu producer ghi bằng chữ hoa/thường khác nhau
            if (!Accessor.TryGetRawValue(notificationData, property.Key, out var rawValue, out var matchedKey))
            {
                continue;
            }

            if (rawValue == null)
            {
                continue;
            }

            var value = ConvertPropertyValue(notificationData, property, matchedKey);

            if (value == null)
            {
                // Giá trị tồn tại nhưng không thể phân tích/không khớp kiểu, cho thấy payload do producer ghi là không hợp lệ
                Logger.LogWarning(
                    "The channel data '{ChannelData}' property '{Property}' of provider '{Provider}' can not be resolved from the key '{Key}'.",
                    registration.Descriptor.PayloadType.FullName, property.Key, registration.Descriptor.ProviderName, matchedKey ?? property.Key);
                return null;
            }

            property.SetValue(channelData, value);
        }

        return channelData;
    }

    /// <summary>
    /// Chuyển đổi giá trị thuộc tính payload
    /// </summary>
    /// <returns>Kết quả chuyển đổi; trả về null khi không thể chuyển đổi hoặc không khớp kiểu</returns>
    protected virtual object? ConvertPropertyValue(
        NotificationData notificationData,
        NotificationChannelDataProperty property,
        string? matchedKey)
    {
        var value = Accessor.Get(notificationData, matchedKey ?? property.Key, property.PropertyType);

        if (value == null)
        {
            return null;
        }

        // Kiểu thời gian chạy của giá trị phải tương thích với kiểu khai báo của thuộc tính
        var underlyingType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

        return underlyingType.IsInstanceOfType(value) ? value : null;
    }

    protected virtual IReadOnlyList<ChannelDataRegistration> GetRegistrations(string providerName)
    {
        lock (_syncLock)
        {
            if (_registrations.TryGetValue(providerName, out var registrations))
            {
                return registrations;
            }

            registrations = _options.Value
                .GetProviderData(providerName)
                .Select(CreateRegistration)
                .ToList();

            _registrations[providerName] = registrations;

            return registrations;
        }
    }

    protected virtual ChannelDataRegistration CreateRegistration(NotificationChannelDataDescriptor descriptor)
    {
        return new ChannelDataRegistration(
            descriptor,
            serviceProvider => ActivatorUtilities.CreateInstance(serviceProvider, descriptor.PayloadType));
    }

    /// <summary>
    /// Mục đăng ký dữ liệu kênh
    /// </summary>
    protected sealed class ChannelDataRegistration
    {
        public NotificationChannelDataDescriptor Descriptor { get; }
        public Func<IServiceProvider, object> Factory { get; }
        public Func<NotificationData, bool> IsPresent => Descriptor.IsPresent;

        public ChannelDataRegistration(
            NotificationChannelDataDescriptor descriptor,
            Func<IServiceProvider, object> factory)
        {
            Descriptor = descriptor;
            Factory = factory;
        }
    }
}
