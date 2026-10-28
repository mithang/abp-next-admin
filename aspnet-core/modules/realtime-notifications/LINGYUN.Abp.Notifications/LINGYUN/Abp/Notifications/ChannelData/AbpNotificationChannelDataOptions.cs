using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Tùy chọn dữ liệu kênh thông báo (payload)
/// </summary>
public class AbpNotificationChannelDataOptions
{
    private readonly Dictionary<string, NotificationChannelDataDescriptorList> _providers
        = new(StringComparer.OrdinalIgnoreCase);

    private readonly List<Type> _payloadTypes = new();

    /// <summary>
    /// Các loại payload đã đăng ký
    /// </summary>
    public IReadOnlyList<Type> PayloadTypes => _payloadTypes;

    /// <summary>
    /// Lấy tập hợp payload của kênh đã chỉ định (sắp xếp theo thứ tự khớp)
    /// </summary>
    public NotificationChannelDataDescriptorList GetProviderData(string providerName)
    {
        if (!_providers.TryGetValue(providerName, out var list))
        {
            list = new NotificationChannelDataDescriptorList();
            _providers[providerName] = list;
        }

        return list;
    }

    /// <summary>
    /// Đăng ký dữ liệu kênh (payload)
    /// </summary>
    /// <remarks>
    /// Tên kênh, thứ tự khớp và chế độ phán đoán sự tồn tại lấy từ
    /// <see cref="NotificationChannelDataAttribute"/>。
    /// </remarks>
    public AbpNotificationChannelDataOptions Add<TChannelData>()
        where TChannelData : NotificationChannelData
    {
        return Add(typeof(TChannelData));
    }

    /// <summary>
    /// Đăng ký dữ liệu kênh (payload)
    /// </summary>
    /// <exception cref="AbpNotificationChannelDataConfigurationException">
    /// Thiếu <see cref="NotificationChannelDataAttribute"/>,
    /// chưa khai báo quy tắc tồn tại, hoặc xung đột mức độ ưu tiên trong cùng kênh
    /// </exception>
    public AbpNotificationChannelDataOptions Add(Type channelDataType)
    {
        Check.NotNull(channelDataType, nameof(channelDataType));

        if (_payloadTypes.Contains(channelDataType))
        {
            return this;
        }

        var attribute = channelDataType.GetCustomAttribute<NotificationChannelDataAttribute>(inherit: false);
        if (attribute == null)
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The channel data type '{channelDataType.FullName}' must be annotated with '{nameof(NotificationChannelDataAttribute)}'.");
        }

        // Ngay trong giai đoạn đăng ký đã kiểm tra khai báo tồn tại, để lỗi cấu hình bộc lộ ngay ở giai đoạn khởi động.
        // Việc kiểm tra chỉ phụ thuộc vào siêu dữ liệu khai báo, vì vậy không cần phân giải bất kỳ dịch vụ nào.
        NotificationChannelDataPresence.Validate(channelDataType);

        var descriptors = GetProviderData(attribute.ProviderName);

        if (descriptors.Any(x => x.Priority == attribute.Priority))
        {
            var conflict = descriptors.First(x => x.Priority == attribute.Priority);
            throw new AbpNotificationChannelDataConfigurationException(
                $"The channel data '{channelDataType.FullName}' and '{conflict.PayloadType.FullName}' of provider '{attribute.ProviderName}' declare the same priority '{attribute.Priority}', the matching order would be ambiguous.");
        }

        descriptors.Add(new NotificationChannelDataDescriptor(
            attribute.ProviderName,
            channelDataType,
            attribute.Priority,
            attribute.Presence,
            NotificationChannelDataPresence.Create(channelDataType)));

        descriptors.Sort((left, right) => left.Priority.CompareTo(right.Priority));

        _payloadTypes.Add(channelDataType);

        return this;
    }
}
