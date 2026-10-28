using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;

/// <summary>
/// Tuần tự hóa System.Text.Json cho tin nhắn thẻ mẫu Webhook
/// </summary>
/// <remarks>
/// <para>
/// <see cref="WebhookTemplateCardMessage"/> là kiểu trừu tượng, và constructor của các kiểu cụ thể có tham số bắt buộc
/// (ví dụ <see cref="WebhookNewsNoticeCardMessage"/> với <c>cardImage</c> / <c>action</c> / <c>mainTitle</c>),
/// do đó không thể khôi phục bằng constructor không tham số — một khi thẻ mẫu đã được lưu bền dưới dạng dữ liệu thông báo thì không thể giải tuần tự hóa lại được nữa.
/// </para>
/// <para>
/// Ở đây khôi phục kiểu cụ thể theo ký hiệu phân biệt <c>card_type</c>. Ký hiệu phân biệt được constructor truyền cho lớp cơ sở, bằng cách đọc
/// hằng chuỗi trong IL của constructor, do đó khi thêm kiểu thẻ mới không cần sửa bộ chuyển đổi này.
/// </para>
/// <para>
/// Tích hợp JSON mà dự án sử dụng là <c>Volo.Abp.Json.SystemTextJson</c>,
/// do đó được mô-đun kênh tự động đăng ký vào tùy chọn toàn cục khi khởi động.
/// </para>
/// </remarks>
public class WebhookTemplateCardSystemTextJsonConverter : JsonConverter<WebhookTemplateCardMessage>
{
    private const byte LdstrOpCode = 0x72;

    private const string CardTypePropertyName = "card_type";

    private static readonly Dictionary<string, Type> CardTypes = new(StringComparer.OrdinalIgnoreCase);

    private static readonly object SyncLock = new();

    private static bool _initialized;

    public override WebhookTemplateCardMessage? Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            return null;
        }

        using var jsonDocument = JsonDocument.ParseValue(ref reader);
        var jsonElement = jsonDocument.RootElement;

        if (jsonElement.ValueKind != JsonValueKind.Object)
        {
            throw new JsonException(
                $"Unable to resolve a webhook template card from a JSON token of kind '{jsonElement.ValueKind}'.");
        }

        var cardType = jsonElement.TryGetProperty(CardTypePropertyName, out var cardTypeElement)
            ? cardTypeElement.GetString()
            : null;

        var concreteType = ResolveCardType(cardType, typeToConvert);
        if (concreteType == null)
        {
            throw new JsonException(
                $"Unable to resolve a webhook template card type for card_type: '{cardType}'.");
        }

        // Giải tuần tự hóa với kiểu cụ thể đã chỉ định, để tránh bộ chuyển đổi này (nếu không sẽ đệ quy)
        return (WebhookTemplateCardMessage?)JsonSerializer.Deserialize(
            jsonElement.GetRawText(),
            concreteType,
            options);
    }

    public override void Write(
        Utf8JsonWriter writer,
        WebhookTemplateCardMessage value,
        JsonSerializerOptions options)
    {
        // Ghi ra theo kiểu thời gian chạy, tránh chỉ xuất các thành viên của lớp cơ sở
        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }

    /// <summary>
    /// Lấy kiểu thẻ cụ thể theo <c>card_type</c>
    /// </summary>
    public static Type? GetCardType(string cardType)
    {
        EnsureInitialized();

        return CardTypes.TryGetValue(cardType, out var type) ? type : null;
    }

    private static Type? ResolveCardType(string? cardType, Type targetType)
    {
        EnsureInitialized();

        if (!cardType.IsNullOrWhiteSpace())
        {
            if (!CardTypes.TryGetValue(cardType!, out var mappedType))
            {
                throw new JsonException($"Unknown webhook template card type: '{cardType}'.");
            }

            if (!targetType.IsAssignableFrom(mappedType))
            {
                throw new JsonException(
                    $"The webhook template card data of card_type: '{cardType}' can not be deserialized as '{targetType.FullName}'.");
            }

            return mappedType;
        }

        // Khi thiếu ký hiệu phân biệt: nếu đích là kiểu cụ thể thì dùng trực tiếp
        if (!targetType.IsAbstract)
        {
            return targetType;
        }

        // Đích trừu tượng và thiếu ký hiệu phân biệt: quay về thẻ mẫu thông báo văn bản
        return CardTypes.TryGetValue(nameof(WebhookTextNoticeCardMessage), out var fallbackType)
            ? fallbackType
            : null;
    }

    private static void EnsureInitialized()
    {
        if (_initialized)
        {
            return;
        }

        lock (SyncLock)
        {
            if (_initialized)
            {
                return;
            }

            foreach (var type in typeof(WebhookTemplateCardSystemTextJsonConverter).Assembly.GetTypes())
            {
                if (type.IsAbstract || !typeof(WebhookTemplateCardMessage).IsAssignableFrom(type))
                {
                    continue;
                }

                foreach (var discriminator in GetDiscriminators(type))
                {
                    CardTypes[discriminator] = type;
                }
            }

            _initialized = true;
        }
    }

    /// <summary>
    /// Lấy ký hiệu phân biệt của kiểu thẻ
    /// </summary>
    /// <remarks>
    /// Ký hiệu phân biệt được constructor truyền cho lớp cơ sở, do đó đọc hằng chuỗi trong IL của constructor.
    /// Đồng thời dùng tên kiểu làm khóa dự phòng.
    /// </remarks>
    private static IEnumerable<string> GetDiscriminators(Type cardType)
    {
        var discriminators = new List<string>();

        foreach (var constructor in cardType.GetConstructors(BindingFlags.Public | BindingFlags.Instance))
        {
            try
            {
                var body = constructor.GetMethodBody();
                if (body == null)
                {
                    continue;
                }

                var discriminator = ReadFirstStringConstant(body.GetILAsByteArray(), constructor.Module);
                if (!discriminator.IsNullOrWhiteSpace() && !discriminators.Contains(discriminator!))
                {
                    discriminators.Add(discriminator!);
                }
            }
            catch
            {
                // Đọc IL thất bại không ảnh hưởng đến ký hiệu phân biệt dự phòng
            }
        }

        discriminators.Add(cardType.Name);

        return discriminators;
    }

    private static string? ReadFirstStringConstant(byte[]? il, Module module)
    {
        if (il == null)
        {
            return null;
        }

        for (var index = 0; index < il.Length; index++)
        {
            if (il[index] != LdstrOpCode || index + 4 >= il.Length)
            {
                continue;
            }

            var token = BitConverter.ToInt32(il, index + 1);

            try
            {
                return module.ResolveString(token);
            }
            catch
            {
                // Không phải thẻ đánh dấu siêu dữ liệu chuỗi, tiếp tục quét
            }
        }

        return null;
    }
}
