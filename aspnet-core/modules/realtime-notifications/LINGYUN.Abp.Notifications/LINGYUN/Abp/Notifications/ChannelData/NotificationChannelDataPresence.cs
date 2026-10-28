using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Xác định tính tồn tại của dữ liệu kênh
/// </summary>
/// <remarks>
public static class NotificationChannelDataPresence
{
    private static readonly Dictionary<string, Func<NotificationData, bool>> Delegates = new();
    private static readonly object SyncLock = new();

    /// <summary>
    /// Lấy chế độ xác định tính tồn tại do tải trọng khai báo
    /// </summary>
    public static NotificationChannelDataPresenceMode GetPresenceMode(Type channelDataType)
    {
        var attribute = channelDataType.GetCustomAttribute<NotificationChannelDataAttribute>(inherit: false);

        return attribute?.Presence ?? NotificationChannelDataPresenceMode.DeclaredProperties;
    }

    /// <summary>
    /// Lấy các khóa thuộc tính tham gia khớp
    /// </summary>
    public static IReadOnlyList<string> GetMatchingKeys(Type channelDataType)
    {
        return channelDataType
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Select(property => new
            {
                Property = property,
                Attribute = property.GetCustomAttribute<NotificationChannelPropertyAttribute>(inherit: true)
            })
            .Where(x => x.Attribute != null && !x.Attribute.IgnoreWhenMatching)
            .Select(x => x.Attribute!.Name.IsNullOrWhiteSpace() ? x.Property.Name : x.Attribute!.Name!)
            .Distinct()
            .ToArray();
    }

    /// <summary>
    /// Kiểm tra khai báo tính tồn tại của tải trọng
    /// </summary>
    /// <exception cref="AbpNotificationChannelDataConfigurationException">
    /// Đã khai báo xác định theo khóa, nhưng không có thuộc tính nào có thể tham gia khớp
    /// </exception>
    public static void Validate(Type channelDataType)
    {
        var mode = GetPresenceMode(channelDataType);

        if (mode != NotificationChannelDataPresenceMode.None && GetMatchingKeys(channelDataType).Count == 0)
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The channel data type '{channelDataType.FullName}' declares the presence mode '{mode}' " +
                $"but has no matchable property. Annotate at least one property with " +
                $"'{nameof(NotificationChannelPropertyAttribute)}' (and do not set " +
                $"'{nameof(NotificationChannelPropertyAttribute.IgnoreWhenMatching)}' to true), " +
                $"or set '{nameof(NotificationChannelDataAttribute.Presence)}' to " +
                $"'{NotificationChannelDataPresenceMode.None}' if the payload always exists.");
        }
    }

    /// <summary>
    /// Tạo delegate xác định tính tồn tại
    /// </summary>
    public static Func<NotificationData, bool> Create(Type channelDataType)
    {
        Validate(channelDataType);

        var mode = GetPresenceMode(channelDataType);
        var keys = GetMatchingKeys(channelDataType);

        var cacheKey = $"{channelDataType.AssemblyQualifiedName}|{mode}|{string.Join(",", keys)}";

        lock (SyncLock)
        {
            if (Delegates.TryGetValue(cacheKey, out var cached))
            {
                return cached;
            }

            var presence = Build(mode, keys);

            Delegates[cacheKey] = presence;

            return presence;
        }
    }

    /// <summary>
    /// Xác định khóa có tồn tại trong dữ liệu thông báo hay không (không phân biệt chữ hoa/thường)
    /// </summary>
    /// <remarks>
    /// Ưu tiên khớp chính xác, khi không trúng thì khớp không phân biệt chữ hoa/thường,
    /// nhất quán với quy tắc của <see cref="INotificationChannelDataAccessor.TryGetRawValue"/>.
    /// </remarks>
    public static bool ContainsKey(NotificationData notificationData, string key)
    {
        if (notificationData == null || key.IsNullOrWhiteSpace())
        {
            return false;
        }

        if (notificationData.ExtraProperties.ContainsKey(key))
        {
            return true;
        }

        foreach (var property in notificationData.ExtraProperties)
        {
            if (string.Equals(property.Key, key, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static Func<NotificationData, bool> Build(
        NotificationChannelDataPresenceMode mode,
        IReadOnlyList<string> keys)
    {
        if (mode == NotificationChannelDataPresenceMode.None)
        {
            return _ => true;
        }

        var notificationData = Expression.Parameter(typeof(NotificationData), "notificationData");
        var containsKeyMethod = typeof(NotificationChannelDataPresence)
            .GetMethod(nameof(ContainsKey), BindingFlags.Public | BindingFlags.Static)!;

        Expression? body = null;

        foreach (var key in keys)
        {
            var containsKey = Expression.Call(
                containsKeyMethod,
                notificationData,
                Expression.Constant(key));

            body = body == null
                ? containsKey
                : mode == NotificationChannelDataPresenceMode.AnyDeclaredProperty
                    ? Expression.OrElse(body, containsKey)
                    : Expression.AndAlso(body, containsKey);
        }

        return Expression
            .Lambda<Func<NotificationData, bool>>(body!, notificationData)
            .Compile();
    }
}
