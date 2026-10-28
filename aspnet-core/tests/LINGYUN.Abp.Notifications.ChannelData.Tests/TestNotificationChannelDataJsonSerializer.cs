using System;
using System.Text.Json;

namespace LINGYUN.Abp.Notifications.ChannelData.Tests;

/// <summary>
/// Triển khai JSON dùng cho kiểm thử
/// </summary>
/// <remarks>
/// Có trách nhiệm giống <c>AbpNotificationChannelDataJsonSerializer</c> (ủy thác cho thư viện JSON),
/// Ở đây dùng trực tiếp <see cref="JsonSerializer"/>,
/// để tránh việc kiểm thử hợp đồng của framework phụ thuộc vào việc tải toàn bộ mô-đun ABP.
/// <para>
/// Các bộ chuyển đổi đa hình đặc thù của kênh (thẻ mẫu, v.v.) được assert trong dự án kiểm thử của từng kênh.
/// </para>
/// </remarks>
public class TestNotificationChannelDataJsonSerializer : INotificationChannelDataJsonSerializer
{
    private static readonly JsonSerializerOptions Options = new();

    public string Serialize(object value, Type valueType)
    {
        return JsonSerializer.Serialize(value, valueType, Options);
    }

    public object? Deserialize(string json, Type targetType)
    {
        return JsonSerializer.Deserialize(json, targetType, Options);
    }
}
