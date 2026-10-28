using System;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Json;

namespace LINGYUN.Abp.AuditLogging.OpenObserve.Serialization;

/// <summary>
/// Bộ tuần tự hóa mặc định
/// </summary>
/// <remarks>
/// Trực tiếp dùng <see cref="IJsonSerializer"/>, để tái sử dụng toàn cục
/// <c>AbpSystemTextJsonSerializerModifiersOptions</c> cấu hình bộ trang trí
/// </remarks>
public class DefaultAuditLoggingOpenObserveSerializer : IAuditLoggingOpenObserveSerializer, ITransientDependency
{
    protected IJsonSerializer JsonSerializer { get; }

    public DefaultAuditLoggingOpenObserveSerializer(IJsonSerializer jsonSerializer)
    {
        JsonSerializer = jsonSerializer;
    }

    public virtual string Serialize<T>(T value)
    {
        return JsonSerializer.Serialize(value!);
    }

    public virtual T? Deserialize<T>(string jsonString)
    {
        if (jsonString.IsNullOrWhiteSpace())
        {
            return default;
        }

        try
        {
            return JsonSerializer.Deserialize<T>(jsonString);
        }
        catch (Exception)
        {
            // Khi dữ liệu lịch sử hoặc cấu trúc không như mong đợi thì trả về giá trị mặc định
            return default;
        }
    }
}
