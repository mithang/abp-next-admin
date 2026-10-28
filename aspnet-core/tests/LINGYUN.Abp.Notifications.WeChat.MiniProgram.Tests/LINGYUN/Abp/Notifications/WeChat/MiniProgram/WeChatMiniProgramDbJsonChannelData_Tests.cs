using LINGYUN.Abp.WeChat.MiniProgram.Messages;
using Shouldly;
using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Json;
using Xunit;

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

/// <summary>
/// Kiểm thử phân tích dữ liệu kênh từ chuỗi JSON trong cơ sở dữ liệu
/// </summary>
/// <remarks>
/// <para>
/// Các kiểm thử trước đó đi theo đường dẫn cùng tiến trình "ghi trong bộ nhớ → đọc", không kiểm chứng được vòng khứ hồi bền vững.
/// Nhóm kiểm thử này bổ sung **liên kết thật**: đưa trực tiếp chuỗi JSON đã lưu trong cơ sở dữ liệu,
/// khôi phục thành <see cref="NotificationData"/> rồi đi tiếp qua bước phân tích phía kênh và phát hành thật,
/// trả lời câu hỏi "lấy dữ liệu từ cơ sở dữ liệu rồi có phân tích bình thường thành định dạng tin nhắn kênh được không".
/// </para>
/// <para>
/// Dữ liệu kênh của chương trình mini đều là giá trị vô hướng, vì vậy giá trị trong kho là kiểu nguyên thủy (không phải chuỗi JSON).
/// </para>
/// </remarks>
public class WeChatMiniProgramDbJsonChannelData_Tests
    : AbpNotificationsWeChatMiniProgramTestsBase
{
    private const string Provider = WeChatMiniProgramNotificationPublishProvider.ProviderName;

    private FakeSubscribeMessager Messager
        => (FakeSubscribeMessager)GetRequiredService<ISubscribeMessager>();

    // ---------- 1. Khóa có tiền tố ----------

    [Fact]
    public void Should_Restore_Channel_Data_From_Db_Json()
    {
        var data = RestoreFromDbJson(
            "{\"title\":\"Trạng thái đơn hàng\",\"message\":\"Đơn hàng của bạn đã được gửi đi\"," +
            "\"wx-mp:template_id\":\"TPL_DB\"," +
            "\"wx-mp:redirect_page\":\"pages/order/detail\"," +
            "\"wx-mp:weapp_state\":\"developer\"," +
            "\"wx-mp:weapp_language\":\"en_US\"}");

        var payload = ChannelDataResolver.Resolve<WeChatMiniProgramSubscribeChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.TemplateId.ShouldBe("TPL_DB");
        payload.RedirectPage.ShouldBe("pages/order/detail");
        payload.WeAppState.ShouldBe("developer");
        payload.WeAppLanguage.ShouldBe("en_US");
    }

    // ---------- 2. Từ JSON trong cơ sở dữ liệu đi thẳng tới kênh (đầu-cuối) ----------

    [Fact]
    public async Task Should_Send_With_Data_Restored_From_Db_Json()
    {
        Messager.Clear();

        var data = RestoreFromDbJson(
            "{\"wx-mp:template_id\":\"TPL_DB_SEND\"," +
            "\"wx-mp:redirect_page\":\"pages/a/b\"," +
            "\"wx-mp:weapp_state\":\"formal\"}");

        await PublishAsync(data, NewUser());

        // Dữ liệu khôi phục từ kho bắt buộc phải gửi đi được thật
        Messager.SentTemplates.Count.ShouldBe(1);

        var sent = Messager.SentTemplates[0];
        sent.TemplateId.ShouldBe("TPL_DB_SEND");
        sent.Page.ShouldBe("pages/a/b");
        sent.State.ShouldBe("formal");
    }

    // ---------- 3. Khóa cũ không có tiền tố ----------

    /// <remarks>
    /// <para>
    /// Khóa cũ nằm ngoài phạm vi khớp của bộ phân tích dữ liệu kênh, mà do kênh Provider đọc dự phòng khi phân tích,
    /// vì vậy ở đây bắt buộc phải đi qua đường dẫn phát hành thật để kiểm chứng.
    /// </para>
    /// <para>
    /// Tên khóa được viết dưới dạng <b>chuỗi JSON</b> (chứ không tham chiếu thành viên đã lỗi thời
    /// <c>WeChatMiniProgramNotificationDataKeys.Legacy</c>):
    /// vừa tránh tham chiếu thành viên lỗi thời, vừa sát với thực tế "trong cơ sở dữ liệu lưu chính là những chuỗi này".
    /// </para>
    /// </remarks>
    [Fact]
    public async Task Should_Restore_Legacy_Keys_From_Db_Json()
    {
        Messager.Clear();

        // Khóa không tiền tố do phiên bản cũ ghi, producer đã cài đặt có thể vẫn đang ghi
        var data = RestoreFromDbJson(
            "{\"TemplateId\":\"TPL_LEGACY\",\"RedirectPage\":\"pages/legacy\"}");

        await PublishAsync(data, NewUser());

        Messager.SentTemplates.Count.ShouldBe(1);
        Messager.SentTemplates[0].TemplateId.ShouldBe("TPL_LEGACY");
        Messager.SentTemplates[0].Page.ShouldBe("pages/legacy");
    }

    [Fact]
    public async Task Should_Prefer_Prefixed_Key_Over_Legacy_Key_From_Db_Json()
    {
        Messager.Clear();

        var data = RestoreFromDbJson(
            "{\"TemplateId\":\"TPL_LEGACY\",\"wx-mp:template_id\":\"TPL_NEW\"}");

        // Bộ phân tích dữ liệu kênh chỉ nhận khóa có tiền tố
        ChannelDataResolver.Resolve<WeChatMiniProgramSubscribeChannelData>(data)!
            .TemplateId.ShouldBe("TPL_NEW");

        // Khi phát hành thật, khóa có tiền tố bắt buộc phải được ưu tiên
        await PublishAsync(data, NewUser());

        Messager.SentTemplates[0].TemplateId.ShouldBe("TPL_NEW");
    }

    // ---------- 4. Khi không có dữ liệu kênh thì không phân tích nhầm ----------

    [Fact]
    public void Should_Resolve_Nothing_When_Db_Json_Has_No_Channel_Data()
    {
        var data = RestoreFromDbJson(
            "{\"title\":\"Trạng thái đơn hàng\",\"message\":\"Đơn hàng của bạn đã được gửi đi\"}");

        ChannelDataResolver.Resolve(Provider, data).ShouldBeEmpty();
    }

    // ---------- Phụ trợ ----------

    /// <summary>
    /// Mô phỏng việc khôi phục dữ liệu thông báo sau khi "lấy chuỗi JSON từ cơ sở dữ liệu"
    /// </summary>
    /// <remarks>
    /// Nhất quán với bộ chuyển đổi giá trị gói thuộc tính của EF: toàn bộ gói thuộc tính là một đối tượng JSON phẳng.
    /// </remarks>
    private NotificationData RestoreFromDbJson(string dbJson)
    {
        var extraProperties = JsonSerializer.Deserialize<ExtraPropertyDictionary>(dbJson);

        return new NotificationData { ExtraProperties = extraProperties };
    }

    private static UserIdentifier NewUser() => new(Guid.NewGuid(), "tester");

    private async Task PublishAsync(NotificationData data, UserIdentifier user)
    {
        var provider = GetRequiredService<WeChatMiniProgramNotificationPublishProvider>();

        var notification = new NotificationInfo
        {
            Name = "Test",
            ContentType = NotificationContentType.Text,
            Data = data
        };
        notification.SetId(1);

        await provider.PublishAsync(new NotificationPublishContext(notification, new[] { user }));
    }
}
