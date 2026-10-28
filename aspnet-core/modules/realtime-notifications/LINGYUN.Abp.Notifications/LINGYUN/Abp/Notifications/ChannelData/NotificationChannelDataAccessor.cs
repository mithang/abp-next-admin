using System;
using System.Collections;
using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Newtonsoft.Json.Linq;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ truy cập dữ liệu (payload) kênh thông báo
/// </summary>
/// <remarks>
/// Triển khai duy nhất cho việc chuyển đổi dữ liệu kênh "gói thuộc tính kiểu yếu ↔ giá trị kiểu mạnh",
/// được <see cref="INotificationChannelDataSerializer"/> và
/// <see cref="INotificationChannelDataResolver"/> dùng chung, đồng thời đảm bảo không phụ thuộc vào triển khai JSON đang dùng.
/// </remarks>
public class NotificationChannelDataAccessor : INotificationChannelDataAccessor, ISingletonDependency
{
    protected ILogger<NotificationChannelDataAccessor> Logger { get; }
    protected INotificationChannelDataJsonSerializer JsonSerializer { get; }

    public NotificationChannelDataAccessor(
        INotificationChannelDataJsonSerializer jsonSerializer,
        ILogger<NotificationChannelDataAccessor>? logger = null)
    {
        JsonSerializer = jsonSerializer;
        Logger = logger ?? NullLogger<NotificationChannelDataAccessor>.Instance;
    }

    public virtual string? GetDataTypeKey(Type payloadType)
    {
        return payloadType.FullName;
    }

    public virtual bool IsPresent(NotificationData notificationData, string key)
    {
        return TryGetRawValue(notificationData, key, out _, out _);
    }

    public virtual bool TryGetRawValue(
        NotificationData notificationData,
        string key,
        out object? value,
        out string? matchedKey)
    {
        value = null;
        matchedKey = null;

        if (notificationData == null || key.IsNullOrWhiteSpace())
        {
            return false;
        }

        if (notificationData.ExtraProperties.TryGetValue(key, out var exactValue))
        {
            value = exactValue;
            matchedKey = key;

            return true;
        }

        // Khi khớp chính xác không trúng, khớp không phân biệt chữ hoa/thường để tương thích với các khóa cũ (ví dụ TemplateId)
        foreach (var property in notificationData.ExtraProperties)
        {
            if (string.Equals(property.Key, key, StringComparison.OrdinalIgnoreCase))
            {
                value = property.Value;
                matchedKey = property.Key;

                return true;
            }
        }

        return false;
    }

    public virtual object? Get(NotificationData notificationData, string key, Type targetType)
    {
        return TryGetRawValue(notificationData, key, out var rawValue, out var matchedKey)
            ? ConvertValue(rawValue!, targetType, matchedKey ?? key)
            : null;
    }

    public virtual TValue? GetValue<TValue>(NotificationData notificationData, string key)
        where TValue : struct
    {
        var value = Get(notificationData, key, typeof(TValue));

        return value is TValue typedValue ? typedValue : null;
    }

    public virtual TValue GetValue<TValue>(NotificationData notificationData, string key, TValue defaultValue)
        where TValue : struct
    {
        return GetValue<TValue>(notificationData, key) ?? defaultValue;
    }

    public virtual string? GetOrNull(NotificationData notificationData, params string[] keys)
    {
        if (notificationData == null || keys == null)
        {
            return null;
        }

        foreach (var key in keys)
        {
            if (TryGetRawValue(notificationData, key, out var value, out _) && value != null)
            {
                return value.ToString();
            }
        }

        return null;
    }

    public virtual void Set(
        NotificationData notificationData,
        string key,
        Type valueType,
        object? value,
        NotificationChannelDataFormat format)
    {
        if (value == null)
        {
            notificationData.TrySetData(key, null);
            return;
        }

        var underlyingType = Nullable.GetUnderlyingType(valueType) ?? valueType;

        if (format == NotificationChannelDataFormat.Json || !NotificationChannelDataValueTypes.IsPrimitive(underlyingType))
        {
            notificationData.TrySetData(key, JsonSerializer.Serialize(value, underlyingType));
            return;
        }

        notificationData.TrySetData(key, value);
    }

    protected virtual object? ConvertValue(object rawValue, Type targetType, string key)
    {
        var underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

        if (underlyingType.IsInstanceOfType(rawValue))
        {
            return rawValue;
        }

        // Khôi phục biểu diễn trung gian (JsonElement / JValue) do các triển khai JSON khác nhau để lại về giá trị gốc CLR trước
        var unwrapped = UnwrapJsonValue(rawValue);
        if (unwrapped == null)
        {
            return null;
        }

        if (underlyingType.IsInstanceOfType(unwrapped))
        {
            return unwrapped;
        }

        if (underlyingType == typeof(string))
        {
            return unwrapped.ToString();
        }

        if (underlyingType.IsEnum)
        {
            return ConvertEnumValue(unwrapped, underlyingType, key);
        }

        if (NotificationChannelDataValueTypes.IsPrimitive(underlyingType))
        {
            return ConvertPrimitiveValue(unwrapped, underlyingType, key);
        }

        return ConvertComplexValue(unwrapped, underlyingType, key);
    }

    /// <summary>
    /// Khôi phục biểu diễn trung gian JSON
    /// </summary>
    /// <remarks>
    /// System.Text.Json tạo ra <c>JsonElement</c>, Newtonsoft tạo ra <c>JValue</c>;
    /// Cả hai đều được khôi phục về giá trị gốc CLR, giúp logic chuyển đổi không phụ thuộc vào triển khai JSON.
    /// </remarks>
    protected virtual object? UnwrapJsonValue(object rawValue)
    {
        if (rawValue is JsonElement jsonElement)
        {
            return UnwrapJsonElement(jsonElement);
        }

        if (rawValue is JValue jValue)
        {
            return jValue.Value;
        }

        return rawValue;
    }

    protected virtual object? UnwrapJsonElement(JsonElement element)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Null:
            case JsonValueKind.Undefined:
                return null;

            case JsonValueKind.String:
                return element.GetString();

            case JsonValueKind.True:
                return true;

            case JsonValueKind.False:
                return false;

            case JsonValueKind.Number:
                if (element.TryGetInt32(out var intValue))
                {
                    return intValue;
                }
                if (element.TryGetInt64(out var longValue))
                {
                    return longValue;
                }
                if (element.TryGetDecimal(out var decimalValue))
                {
                    return decimalValue;
                }
                return element.GetDouble();

            default:
                // Mảng/đối tượng: tham gia giải tuần tự hóa tiếp theo bằng văn bản JSON gốc
                return element.GetRawText();
        }
    }

    protected virtual object? ConvertEnumValue(object rawValue, Type underlyingType, string key)
    {
        if (rawValue is string enumName)
        {
            try
            {
                return Enum.Parse(underlyingType, enumName, ignoreCase: true);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex,
                    "Failed to parse the channel data '{Key}' as enum '{Type}', the value will be ignored.",
                    key, underlyingType.FullName);
                return null;
            }
        }

        try
        {
            return Enum.ToObject(
                underlyingType,
                Convert.ChangeType(rawValue, Enum.GetUnderlyingType(underlyingType), CultureInfo.InvariantCulture)!);
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex,
                "Failed to convert the channel data '{Key}' to enum '{Type}', the value will be ignored.",
                key, underlyingType.FullName);
            return null;
        }
    }

    protected virtual object? ConvertPrimitiveValue(object rawValue, Type underlyingType, string key)
    {
        // Sau khi JSON đi-về, giá trị boolean có thể xuất hiện dưới dạng số hoặc chuỗi, trong khi Convert chỉ nhận "True"/"False"
        if (underlyingType == typeof(bool) && TryConvertBoolean(rawValue, out var booleanValue))
        {
            return booleanValue;
        }

        try
        {
            return Convert.ChangeType(rawValue, underlyingType, CultureInfo.InvariantCulture);
        }
        catch (Exception ex) when (ex is FormatException || ex is InvalidCastException || ex is OverflowException)
        {
            // Sau khi JSON đi-về, chuỗi có thể bị bọc trong dấu ngoặc kép, ví dụ "\"1\"", thử chuyển đổi lại một lần sau khi bỏ dấu ngoặc kép
            if (rawValue is string text)
            {
                var trimmed = text.Trim().Trim('"');
                if (!ReferenceEquals(trimmed, text) && trimmed.Length > 0)
                {
                    try
                    {
                        return Convert.ChangeType(trimmed, underlyingType, CultureInfo.InvariantCulture);
                    }
                    catch (Exception inner) when (inner is FormatException || inner is InvalidCastException || inner is OverflowException)
                    {
                        // Bỏ qua, ghi nhật ký thống nhất ở phía dưới
                    }
                }
            }

            Logger.LogWarning(ex,
                "Failed to convert the channel data '{Key}' of '{ValueType}' to '{TargetType}', the value will be ignored.",
                key, rawValue.GetType().FullName, underlyingType.FullName);
            return null;
        }
    }

    protected virtual object? ConvertComplexValue(object rawValue, Type underlyingType, string key)
    {
        if (rawValue is not string json)
        {
            Logger.LogWarning(
                "The channel data '{Key}' is stored as '{ValueType}', but '{TargetType}' was expected, the value will be ignored.",
                key, rawValue.GetType().FullName, underlyingType.FullName);
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize(json, underlyingType);
        }
        catch (Exception ex)
        {
            // Khi payload không hợp lệ chỉ ghi nhật ký và trả về null,
            // Bên gọi sẽ báo lỗi rõ ràng thông qua "đã khai báo nhưng phân tích cú pháp thất bại"
            Logger.LogWarning(ex,
                "Failed to deserialize the channel data '{Key}' to '{TargetType}', the value will be ignored.",
                key, underlyingType.FullName);
            return null;
        }
    }

    /// <summary>
    /// Thử chuyển đổi các dạng biểu diễn khác nhau thành giá trị boolean
    /// </summary>
    /// <remarks>
    /// Các dạng số <c>0/1</c> và chuỗi <c>"0"/"1"</c> / <c>"true"/"false"</c> đều được nhận biết,
    /// <c>Convert.ChangeType</c> chỉ chấp nhận <c>"True"/"False"</c>, vì vậy cần xử lý riêng.
    /// </remarks>
    protected virtual bool TryConvertBoolean(object rawValue, out bool result)
    {
        switch (rawValue)
        {
            case bool booleanValue:
                result = booleanValue;
                return true;

            case string text:
                var trimmed = text.Trim().Trim('"');
                if (bool.TryParse(trimmed, out var parsed))
                {
                    result = parsed;
                    return true;
                }
                if (double.TryParse(trimmed, NumberStyles.Any, CultureInfo.InvariantCulture, out var number))
                {
                    result = number != 0;
                    return true;
                }
                break;

            default:
                try
                {
                    result = Convert.ToDouble(rawValue, CultureInfo.InvariantCulture) != 0;
                    return true;
                }
                catch (Exception ex) when (ex is FormatException || ex is InvalidCastException || ex is OverflowException)
                {
                    break;
                }
        }

        result = false;
        return false;
    }
}
