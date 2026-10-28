using LINGYUN.Abp.Notifications;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Shouldly;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace LINGYUN.Abp.Notifications.ChannelData.Tests;

/// <summary>
/// Kiểm thử hợp đồng khung dữ liệu kênh (payload)
/// </summary>
/// <remarks>
/// <para>
/// Tệp này chỉ kiểm thử **hợp đồng khung** mà thôi: chuyển đổi kiểu yếu, xác định sự tồn tại, kiểm tra lúc đăng ký,
/// sắp xếp theo mức độ ưu tiên, vòng lặp JSON. Payload dùng để kiểm thử là các kiểu stub được định nghĩa trong tệp này.
/// </para>
/// <para>
/// Kiểm thử dữ liệu của **kênh cụ thể** nằm trong từng dự án kiểm thử riêng (trước tiên new đối tượng tin nhắn →
/// <c>IJsonSerializer</c> tuần tự hóa → phía kênh xác thực):
/// <list type="bullet">
/// <item><c>LINGYUN.Abp.Notifications.WeChat.Work.Tests</c></item>
/// <item><c>LINGYUN.Abp.Notifications.Webhook.WeChat.Work.Tests</c></item>
/// <item><c>LINGYUN.Abp.Notifications.WeChat.MiniProgram.Tests</c></item>
/// <item><c>LINGYUN.Abp.Notifications.WxPusher.Tests</c></item>
/// <item><c>LINGYUN.Abp.Notifications.PushPlus.Tests</c></item>
/// </list>
/// </para>
/// </remarks>
public class NotificationChannelData_Tests
{
    // ---------- 1. Chuyển đổi kiểu yếu ----------

    [Theory]
    [InlineData((byte)1)]
    [InlineData(1)]
    [InlineData(1L)]
    [InlineData("1")]
    [InlineData("\"1\"")]
    [InlineData(true)]
    [InlineData("true")]
    public void Should_Coerce_All_Representations_To_Bool(object stored)
    {
        var data = new NotificationData();
        data.TrySetData("key", stored);

        CreateResolver().GetValue(data, "key", false).ShouldBeTrue();
    }

    [Fact]
    public void Should_Distinguish_Unset_From_Explicit_False()
    {
        var unset = new NotificationData();
        CreateResolver().GetValue<bool>(unset, "key").ShouldBeNull();

        var explicitFalse = new NotificationData();
        explicitFalse.TrySetData("key", 0);
        CreateResolver().GetValue<bool>(explicitFalse, "key").ShouldBe(false);
    }

    [Fact]
    public void Should_Read_Values_After_Json_RoundTrip()
    {
        // Dữ liệu thông báo khi lưu trữ/thử lại khi thất bại/phân phối liên tiến trình chắc chắn phải trải qua vòng lặp JSON
        var data = new NotificationData();
        data.TrySetData("key", (byte)1);

        var roundTripped = RoundTrip(data);
        roundTripped.ExtraProperties["key"].ShouldNotBeOfType<byte>();

        CreateResolver().GetValue(roundTripped, "key", false).ShouldBeTrue();
    }

    [Fact]
    public void Should_Match_Keys_Case_Insensitively()
    {
        var data = new NotificationData();
        data.TrySetData("my-stub:key", "value-1");

        var resolver = CreateResolver();

        // Khớp chính xác
        resolver.GetOrNull(data, "my-stub:key").ShouldBe("value-1");
        // Mọi kiểu viết hoa/thường đều phải khớp
        resolver.GetOrNull(data, "MY-STUB:KEY").ShouldBe("value-1");
        resolver.GetOrNull(data, "My-Stub:Key").ShouldBe("value-1");
    }

    // ---------- 2. Xác định sự tồn tại (khai báo) ----------

    [Fact]
    public void Should_Detect_Explicit_Payload()
    {
        var data = new NotificationData();
        ChannelData().Write(data, new PriorityStubA { A = "a" });

        CreateResolver().IsDeclared(data, typeof(PriorityStubA)).ShouldBeTrue();
        CreateResolver().IsDeclared(data, typeof(PriorityStubB)).ShouldBeFalse();
    }

    [Fact]
    public void Should_Not_Treat_Ignored_Properties_As_Payload()
    {
        var data = new NotificationData();
        // Chỉ ghi thuộc tính được đánh dấu là "chỉ đọc": không được coi là đã khai báo payload
        data.TrySetData("stubB:optional", "value");

        CreateResolver().IsDeclared(data, typeof(PriorityStubB)).ShouldBeFalse();
    }

    [Fact]
    public void Should_Apply_AnyDeclaredProperty_Presence_Mode()
    {
        var resolver = CreateResolver();

        var first = new NotificationData();
        first.TrySetData("stub-many:first", "v");
        resolver.IsDeclared(first, typeof(AnyDeclaredPropertyStub)).ShouldBeTrue();

        var second = new NotificationData();
        second.TrySetData("stub-many:second", "v");
        resolver.IsDeclared(second, typeof(AnyDeclaredPropertyStub)).ShouldBeTrue();

        // Đã khai báo xác định theo khóa, nhưng không ghi khóa nào -> không tồn tại
        resolver.IsDeclared(new NotificationData(), typeof(AnyDeclaredPropertyStub)).ShouldBeFalse();
    }

    [Fact]
    public void Should_Ignore_Matching_For_Optional_Properties()
    {
        var data = new NotificationData();
        // Chỉ ghi thuộc tính "chỉ đọc" -> không tính là payload
        data.TrySetData("stubB:optional", "value");
        CreateResolver().IsDeclared(data, typeof(PriorityStubB)).ShouldBeFalse();

        // Ghi khóa định danh -> tính là payload
        var withIdentity = new NotificationData();
        withIdentity.TrySetData("stub:b", "value");
        CreateResolver().IsDeclared(withIdentity, typeof(PriorityStubB)).ShouldBeTrue();
    }

    [Fact]
    public void Should_Allow_Always_Present_Payload()
    {
        var resolver = CreateResolver();

        // Presence = None: tồn tại vô điều kiện
        resolver.IsDeclared(new NotificationData(), typeof(AlwaysPresentStub)).ShouldBeTrue();

        var payload = resolver.Resolve<AlwaysPresentStub>(new NotificationData());
        payload.ShouldNotBeNull();
    }

    // ---------- 3. Kiểm tra lúc đăng ký ----------

    [Fact]
    public void Should_Throw_When_Presence_Declared_Without_Matchable_Property()
    {
        var exception = Should.Throw<AbpNotificationChannelDataConfigurationException>(
            () => CreateOptions().Add<MissingMatchablePropertyStub>());

        exception.Message.ShouldContain("matchable property");
    }

    [Fact]
    public void Should_Reject_Missing_Channel_Data_Attribute()
    {
        var exception = Should.Throw<AbpNotificationChannelDataConfigurationException>(
            () => CreateOptions().Add<NoAttributeStub>());

        exception.Message.ShouldContain("NotificationChannelDataAttribute");
    }

    [Fact]
    public void Should_Reject_Duplicate_Priority_In_Same_Provider()
    {
        var options = CreateOptions();
        options.Add<PriorityStubA>();

        var exception = Should.Throw<AbpNotificationChannelDataConfigurationException>(
            () => options.Add<DuplicatePriorityStub>());

        exception.Message.ShouldContain("same priority");
    }

    // ---------- 4. Phân tích và sắp xếp ----------

    [Fact]
    public void Should_Resolve_Payloads_In_Declared_Priority_Order()
    {
        var data = new NotificationData();
        ChannelData().Write(data, new PriorityStubB { B = "b" });
        ChannelData().Write(data, new PriorityStubA { A = "a" });

        var resolved = CreateResolver().Resolve(TestProvider, data);

        // Chỉ khai báo A và B; AnyDeclaredPropertyStub chưa được ghi, AlwaysPresentStub(Presence=None)
        // tồn tại vô điều kiện, vì vậy tổng cộng 3 cái
        resolved.Count.ShouldBe(3);
        // Priority: AlwaysPresentStub=400, A=100, B=200 -> sau khi sắp xếp là A, B, Always
        resolved[0].ShouldBeOfType<PriorityStubA>();
        resolved[1].ShouldBeOfType<PriorityStubB>();
        resolved[2].ShouldBeOfType<AlwaysPresentStub>();
    }

    [Fact]
    public void Should_Resolve_Payload_After_Json_RoundTrip()
    {
        var data = new NotificationData();
        ChannelData().Write(data, new PriorityStubA { A = "Tiêu đề thẻ" });

        // Payload phức tạp được lưu dưới dạng chuỗi JSON, sau vòng lặp vẫn phải khôi phục được thành kiểu mạnh
        data.ExtraProperties["stub:a"].ShouldBeOfType<string>();

        var payload = CreateResolver().Resolve<PriorityStubA>(RoundTrip(data));

        payload.ShouldNotBeNull();
        payload!.A.ShouldBe("Tiêu đề thẻ");
    }

    [Fact]
    public void Should_Not_Throw_For_Invalid_Payload_But_Report_Declared()
    {
        var data = new NotificationData();
        // Payload phức tạp được lưu dưới dạng chuỗi JSON; ở đây ghi JSON không hợp lệ
        data.TrySetData("stub:json", "{ this is not json }");

        var resolver = CreateResolver();

        // IsDeclared vẫn là true (bên sản xuất thực sự đã ghi), Resolve trả về null (phân tích thất bại, chỉ ghi nhật ký)
        resolver.IsDeclared(data, typeof(JsonPayloadStub)).ShouldBeTrue();
        resolver.Resolve<JsonPayloadStub>(data).ShouldBeNull();
        // Thông tin chẩn đoán đưa ra tên khóa thực tế đã khớp
        resolver.GetKey(data, typeof(JsonPayloadStub)).ShouldBe("stub:json");
    }

    [Fact]
    public void Should_Resolve_Complex_Payload_After_Json_RoundTrip()
    {
        var data = new NotificationData();
        ChannelData().Write(data, new JsonPayloadStub
        {
            Payload = new StubPayload { Name = "Tiêu đề", Count = 3 }
        });

        // Kiểu phức tạp được lưu dưới dạng chuỗi JSON
        data.ExtraProperties["stub:json"].ShouldBeOfType<string>();

        var payload = CreateResolver().Resolve<JsonPayloadStub>(RoundTrip(data));

        payload.ShouldNotBeNull();
        payload!.Payload.ShouldNotBeNull();
        payload.Payload!.Name.ShouldBe("Tiêu đề");
        payload.Payload.Count.ShouldBe(3);
    }

    // ---------- 5. Hành vi đồng thời của bộ nhớ đệm siêu dữ liệu thuộc tính ----------

    /// <remarks>
    /// Trên đường phân phối, mỗi payload đều đọc bộ nhớ đệm siêu dữ liệu thuộc tính, mà lần xây dựng đầu tiên của bộ nhớ đệm phải làm phản xạ và
    /// biên dịch biểu thức, vì vậy "chỉ xây dựng một lần khi đồng thời cao và đường đọc không khóa" là thuộc tính bắt buộc phải đảm bảo.
    /// </remarks>
    [Fact]
    public void Should_Build_Property_Metadata_Once_Under_Concurrency()
    {
        var payloadTypes = new[]
        {
            typeof(JsonPayloadStub),
            typeof(PriorityStubA),
            typeof(PriorityStubB),
            typeof(AnyDeclaredPropertyStub),
            typeof(AlwaysPresentStub)
        };

        // Mỗi kiểu lấy đồng thời nhiều lần, bao phủ cuộc đua "nhiều luồng cùng xây dựng lần đầu cùng một kiểu"
        var results = new NotificationChannelDataProperty[payloadTypes.Length * 64][];

        Parallel.For(0, results.Length, index =>
        {
            results[index] = NotificationChannelDataPropertyCache.GetProperties(
                payloadTypes[index % payloadTypes.Length]);
        });

        foreach (var payloadType in payloadTypes)
        {
            var expected = NotificationChannelDataPropertyCache.GetProperties(payloadType);

            var observed = results
                .Where(x => x.Length == expected.Length)
                .Where(x => x.Select(p => p.Key).SequenceEqual(expected.Select(p => p.Key)))
                .ToArray();

            // Mọi lệnh gọi đồng thời đều phải thấy cùng một siêu dữ liệu (cùng một thể hiện), chứng minh chỉ xây dựng một lần
            observed.ShouldNotBeEmpty();
            observed.ShouldAllBe(x => ReferenceEquals(x, expected));
        }
    }

    [Fact]
    public void Should_Return_Same_Instance_On_Repeated_Calls()
    {
        var first = NotificationChannelDataPropertyCache.GetProperties(typeof(JsonPayloadStub));
        var second = NotificationChannelDataPropertyCache.GetProperties(typeof(JsonPayloadStub));

        ReferenceEquals(first, second).ShouldBeTrue();
    }

    // ---------- 6. Payload dùng để kiểm thử ----------

    private const string TestProvider = "stub";

    [NotificationChannelData(TestProvider, Priority = 100)]
    private class PriorityStubA : NotificationChannelData
    {
        [NotificationChannelProperty("stub:a")]
        public string? A { get; set; }
    }

    [NotificationChannelData(TestProvider, Priority = 200)]
    private class PriorityStubB : NotificationChannelData
    {
        [NotificationChannelProperty("stub:b")]
        public string? B { get; set; }

        [NotificationChannelProperty("stubB:optional", IgnoreWhenMatching = true)]
        public string? Optional { get; set; }
    }

    [NotificationChannelData(TestProvider, Priority = 100)]
    private class DuplicatePriorityStub : NotificationChannelData
    {
        [NotificationChannelProperty("stub:dup")]
        public string? Value { get; set; }
    }

    [NotificationChannelData(TestProvider, Priority = 300,
        Presence = NotificationChannelDataPresenceMode.AnyDeclaredProperty)]
    private class AnyDeclaredPropertyStub : NotificationChannelData
    {
        [NotificationChannelProperty("stub-many:first")]
        public string? First { get; set; }

        [NotificationChannelProperty("stub-many:second")]
        public string? Second { get; set; }
    }

    [NotificationChannelData(TestProvider, Priority = 400,
        Presence = NotificationChannelDataPresenceMode.None)]
    private class AlwaysPresentStub : NotificationChannelData
    {
        [NotificationChannelProperty("stub-always:value")]
        public string? Value { get; set; }
    }

    [NotificationChannelData(TestProvider, Priority = 500,
        Presence = NotificationChannelDataPresenceMode.DeclaredProperties)]
    private class MissingMatchablePropertyStub : NotificationChannelData
    {
        // Không có thuộc tính nào mang [NotificationChannelProperty]
        public string? Value { get; set; }
    }

    /// <summary>
    /// Payload phức tạp (được lưu dưới dạng chuỗi JSON)
    /// </summary>
    [NotificationChannelData(TestProvider, Priority = 600)]
    private class JsonPayloadStub : NotificationChannelData
    {
        [NotificationChannelProperty("stub:json")]
        public StubPayload? Payload { get; set; }
    }

    private class StubPayload
    {
        public string? Name { get; set; }

        public int Count { get; set; }
    }

    private class NoAttributeStub : NotificationChannelData
    {
        public string? Value { get; set; }
    }

    // ---------- Hỗ trợ ----------

    private static AbpNotificationChannelDataOptions CreateOptions()
    {
        // Tùy chọn là dữ liệu thuần túy: xác định sự tồn tại là thuần tĩnh, khi đăng ký không cần phân tích dịch vụ nào
        return new AbpNotificationChannelDataOptions();
    }

    private static NotificationChannelDataResolver CreateResolver()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton<INotificationChannelDataJsonSerializer,
            TestNotificationChannelDataJsonSerializer>();
        services.AddSingleton<INotificationChannelDataAccessor, NotificationChannelDataAccessor>();
        services.AddSingleton<INotificationChannelDataPresenceProvider, NotificationChannelDataPresenceProvider>();
        services.AddSingleton<INotificationChannelDataResolver, NotificationChannelDataResolver>();

        services.PostConfigure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<PriorityStubA>();
            options.Add<PriorityStubB>();
            options.Add<AnyDeclaredPropertyStub>();
            options.Add<AlwaysPresentStub>();
            options.Add<JsonPayloadStub>();
        });

        var provider = services.BuildServiceProvider();

        return (NotificationChannelDataResolver)provider.GetRequiredService<INotificationChannelDataResolver>();
    }

    private static INotificationChannelDataSerializer ChannelData()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton<INotificationChannelDataJsonSerializer,
            TestNotificationChannelDataJsonSerializer>();
        services.AddSingleton<INotificationChannelDataAccessor, NotificationChannelDataAccessor>();
        services.AddSingleton<INotificationChannelDataPresenceProvider, NotificationChannelDataPresenceProvider>();
        services.AddSingleton<INotificationChannelDataSerializer, NotificationChannelDataSerializer>();

        return services.BuildServiceProvider().GetRequiredService<INotificationChannelDataSerializer>();
    }

    private static NotificationData RoundTrip(NotificationData data)
    {
        var json = JsonSerializer.Serialize(data.ExtraProperties);

        return new NotificationData
        {
            ExtraProperties = JsonSerializer.Deserialize<Volo.Abp.Data.ExtraPropertyDictionary>(json)!
        };
    }
}
