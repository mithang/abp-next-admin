using LINGYUN.Abp.Tests;
using System.Reflection;
using Volo.Abp.Json;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Lớp cơ sở kiểm tra dữ liệu kênh
/// </summary>
/// <remarks>
/// Các dự án kiểm tra của từng kênh kế thừa lớp này và chỉ định mô-đun kiểm tra của riêng mình (mô-đun đó phụ thuộc vào mô-đun kênh thật),
/// để dùng chung cùng một cách viết "new đối tượng thông báo → <c>IJsonSerializer</c> tuần tự hóa → phía kênh xác thực".
/// </remarks>
public abstract class NotificationChannelDataTestsBase<TStartupModule> : AbpTestsBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    /// <summary>
    /// Bộ phân tích phía kênh
    /// </summary>
    protected INotificationChannelDataResolver ChannelDataResolver
        => GetRequiredService<INotificationChannelDataResolver>();

    /// <summary>
    /// Bộ truy cập dữ liệu kênh (phía sản xuất dùng để ghi)
    /// </summary>
    protected INotificationChannelDataAccessor ChannelDataAccessor
        => GetRequiredService<INotificationChannelDataAccessor>();

    /// <summary>
    /// Bộ tuần tự hóa phía nhà sản xuất
    /// </summary>
    protected INotificationChannelDataSerializer ChannelDataSerializer
        => GetRequiredService<INotificationChannelDataSerializer>();

    /// <summary>
    /// Bộ tuần tự hóa JSON toàn cục ABP
    /// </summary>
    protected IJsonSerializer JsonSerializer
        => GetRequiredService<IJsonSerializer>();

    /// <summary>
    /// Chỉ tuần tự hóa đối tượng thông báo, thuận tiện cho việc khẳng định hợp đồng JSON
    /// </summary>
    protected string Serialize<TPayload>(TPayload payload)
        where TPayload : class
    {
        return JsonSerializer.Serialize(payload);
    }

    /// <summary>
    /// Tuần tự hóa đối tượng thông báo rồi ghi vào khóa tải trọng của dữ liệu thông báo
    /// </summary>
    /// <remarks>
    /// Đi theo đường dẫn sản xuất: <see cref="INotificationChannelDataAccessor.Set"/> đối với kiểu phức tạp
    /// gọi <see cref="IJsonSerializer"/> tuần tự hóa, hoàn toàn nhất quán với kết quả ghi của nhà sản xuất.
    /// </remarks>
    protected NotificationData WriteChannelData<TChannelData>(TChannelData channelData)
        where TChannelData : NotificationChannelData
    {
        return MergeChannelData(new NotificationData(), channelData);
    }

    /// <summary>
    /// Tuần tự hóa đối tượng thông báo rồi hợp nhất ghi vào dữ liệu thông báo đã có
    /// </summary>
    protected NotificationData MergeChannelData<TChannelData>(
        NotificationData notificationData,
        TChannelData channelData)
        where TChannelData : NotificationChannelData
    {
        foreach (var property in typeof(TChannelData).GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            var attribute = property.GetCustomAttribute<NotificationChannelPropertyAttribute>();
            if (attribute == null)
            {
                continue;
            }

            var key = string.IsNullOrWhiteSpace(attribute.Name) ? property.Name : attribute.Name!;

            ChannelDataAccessor.Set(
                notificationData,
                key,
                property.PropertyType,
                property.GetValue(channelData),
                NotificationChannelDataFormat.Auto);
        }

        return notificationData;
    }
}
