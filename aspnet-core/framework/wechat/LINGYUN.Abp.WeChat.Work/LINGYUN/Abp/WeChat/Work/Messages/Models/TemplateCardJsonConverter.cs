using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;

/// <summary>
/// Tuần tự hóa thông điệp thẻ mẫu
/// </summary>
/// <remarks>
/// <para>
/// <see cref="TemplateCard"/> là kiểu trừu tượng, Newtonsoft.Json không thể khởi tạo trực tiếp nó,
/// khiến thẻ mẫu một khi đã được tuần tự hóa (ví dụ như dữ liệu thông báo được lưu trữ bền vững, hoặc đi vào hàng đợi thử lại khi thất bại) thì không thể khôi phục lại được nữa:
/// <c>Could not create an instance of type ... Type is an interface or abstract class</c>。
/// </para>
/// <para>
/// Ở đây khôi phục kiểu thẻ cụ thể theo bộ phân biệt <c>card_type</c>. Bộ phân biệt được truyền cho lớp cơ sở trong hàm khởi tạo
/// (ví dụ <c>base("template_card", taskId)</c>), thu được bằng cách đọc hằng chuỗi trong IL của hàm khởi tạo,
/// do đó khi thêm kiểu thẻ mới không cần sửa đổi bộ chuyển đổi này.
/// </para>
/// </remarks>
public class TemplateCardJsonConverter : JsonConverter
{
    private const byte LdstrOpCode = 0x72;

    private static readonly Dictionary<string, Type> CardTypes = new Dictionary<string, Type>(StringComparer.OrdinalIgnoreCase);

    private static readonly object SyncLock = new object();

    private static bool _initialized;

    /// <summary>
    /// Chỉ tiếp quản kiểu thẻ trừu tượng
    /// </summary>
    /// <remarks>
    /// Kiểu thẻ cụ thể được phân tích đệ quy sau khi bộ chuyển đổi này chỉ định rõ kiểu đích,
    /// nếu ở đây cũng trả về true cho kiểu cụ thể sẽ gây ra đệ quy vô hạn.
    /// </remarks>
    public override bool CanConvert(Type objectType)
    {
        return objectType == typeof(TemplateCard);
    }

    public override bool CanWrite => false;

    public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
    {
        throw new NotSupportedException("The template card json converter does not support writing.");
    }

    public override object? ReadJson(
        JsonReader reader,
        Type objectType,
        object? existingValue,
        JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.Null)
        {
            return null;
        }

        var jsonObject = JObject.Load(reader);

        var cardType = jsonObject["card_type"]?.ToString();
        var concreteType = ResolveCardType(cardType, objectType);

        if (concreteType == null)
        {
            throw new JsonSerializationException(
                $"Unable to resolve a template card type for card_type: '{cardType}'.");
        }

        using var subReader = jsonObject.CreateReader();

        return serializer.Deserialize(subReader, concreteType);
    }

    /// <summary>
    /// Phân tích kiểu cụ thể của thẻ
    /// </summary>
    private static Type? ResolveCardType(string? cardType, Type targetType)
    {
        EnsureInitialized();

        if (!cardType.IsNullOrWhiteSpace())
        {
            if (!CardTypes.TryGetValue(cardType!, out var mappedType))
            {
                throw new JsonSerializationException(
                    $"Unknown template card type: '{cardType}'.");
            }

            if (!targetType.IsAssignableFrom(mappedType))
            {
                throw new JsonSerializationException(
                    $"The template card data of card_type: '{cardType}' can not be deserialized as '{targetType.FullName}'.");
            }

            return mappedType;
        }

        // Khi thiếu bộ phân biệt, nếu đích là kiểu cụ thể thì dùng trực tiếp nó
        if (!targetType.IsAbstract)
        {
            return targetType;
        }

        // Khi đích là kiểu trừu tượng và thiếu bộ phân biệt, theo hành vi trước đây sẽ quay về thẻ mẫu văn bản
        return CardTypes.TryGetValue(nameof(TextTemplateCard), out var fallbackType) ? fallbackType : null;
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

            foreach (var type in typeof(TemplateCardJsonConverter).Assembly.GetTypes())
            {
                if (type.IsAbstract || !typeof(TemplateCard).IsAssignableFrom(type))
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
    /// Lấy bộ phân biệt của kiểu thẻ
    /// </summary>
    /// <remarks>
    /// Bộ phân biệt được truyền cho lớp cơ sở bởi hàm khởi tạo, do đó đọc hằng chuỗi trong IL của hàm khởi tạo.
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
                // Đọc IL thất bại không ảnh hưởng đến bộ phân biệt dự phòng
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
                // Không phải thẻ siêu dữ liệu chuỗi, tiếp tục quét
            }
        }

        return null;
    }
}
