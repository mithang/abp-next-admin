using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ nhớ đệm siêu dữ liệu thuộc tính dữ liệu kênh
/// </summary>
/// <remarks>
/// <para>
/// Bộ nhớ đệm siêu dữ liệu thuần phản xạ (không JSON, không nhật ký, không phụ thuộc cấu hình), vì vậy được giữ tĩnh để tránh
/// việc tiêm lặp lại giữa bộ tuần tự hóa, bộ phân tích và nhà cung cấp kiểm tra sự tồn tại.
/// </para>
/// </remarks>
public static class NotificationChannelDataPropertyCache
{
    /// <summary>
    /// Bộ nhớ đệm siêu dữ liệu thuộc tính
    /// </summary>
    /// <remarks>
    /// Giá trị được bọc bằng <see cref="Lazy{T}"/>: factory của <c>GetOrAdd</c> có thể được gọi nhiều lần khi chạy đồng thời,
    /// nhưng chỉ một thể hiện được ghi vào và được các lần đọc sau đó sử dụng, các thể hiện còn lại bị loại bỏ, vì vậy việc xây dựng vẫn chỉ xảy ra một lần.
    /// </remarks>
    private static readonly ConcurrentDictionary<Type, Lazy<NotificationChannelDataProperty[]>> PropertiesCache
        = new();

    /// <summary>
    /// Lấy siêu dữ liệu thuộc tính của kiểu tải trọng
    /// </summary>
    public static NotificationChannelDataProperty[] GetProperties(Type channelDataType)
    {
        return PropertiesCache
            .GetOrAdd(
                channelDataType,
                type => new Lazy<NotificationChannelDataProperty[]>(
                    () => CreateProperties(type),
                    LazyThreadSafetyMode.ExecutionAndPublication))
            .Value;
    }

    /// <summary>
    /// Xây dựng siêu dữ liệu thuộc tính
    /// </summary>
    private static NotificationChannelDataProperty[] CreateProperties(Type channelDataType)
    {
        return channelDataType
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Select(TryCreateProperty)
            .Where(x => x != null)
            .Select(x => x!)
            .ToArray();
    }

    private static NotificationChannelDataProperty? TryCreateProperty(PropertyInfo property)
    {
        var attribute = property.GetCustomAttribute<NotificationChannelPropertyAttribute>(inherit: true);
        if (attribute == null || !property.CanRead)
        {
            return null;
        }

        var key = attribute.Name.IsNullOrWhiteSpace() ? property.Name : attribute.Name!;

        return new NotificationChannelDataProperty(
            key,
            property.PropertyType,
            NotificationChannelDataFormat.Auto,
            attribute.IgnoreWhenMatching,
            CreateGetter(property),
            property.CanWrite ? CreateSetter(property) : null!);
    }

    private static Func<object, object?> CreateGetter(PropertyInfo property)
    {
        var instance = Expression.Parameter(typeof(object), "instance");
        var typedInstance = Expression.Convert(instance, property.DeclaringType!);
        var propertyAccess = Expression.Property(typedInstance, property);

        return Expression
            .Lambda<Func<object, object?>>(Expression.Convert(propertyAccess, typeof(object)), instance)
            .Compile();
    }

    private static Action<object, object?> CreateSetter(PropertyInfo property)
    {
        var instance = Expression.Parameter(typeof(object), "instance");
        var value = Expression.Parameter(typeof(object), "value");
        var typedInstance = Expression.Convert(instance, property.DeclaringType!);

        var assign = Expression.Assign(
            Expression.Property(typedInstance, property),
            Expression.Convert(value, property.PropertyType));

        return Expression
            .Lambda<Action<object, object?>>(assign, instance, value)
            .Compile();
    }
}
