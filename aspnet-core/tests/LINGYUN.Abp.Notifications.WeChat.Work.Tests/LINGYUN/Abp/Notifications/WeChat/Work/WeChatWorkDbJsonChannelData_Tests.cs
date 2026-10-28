using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Json;
using Xunit;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Kiểm thử phân giải dữ liệu kênh từ chuỗi JSON cơ sở dữ liệu
/// </summary>
/// <remarks>
/// <para>
/// Các kiểm thử trước đó đi theo đường dẫn cùng tiến trình "ghi trong bộ nhớ → đọc", không kiểm chứng được vòng đi-về bền vững.
/// Nhóm kiểm thử này bổ sung **luồng thực tế**: đưa trực tiếp chuỗi JSON đã lưu trong cơ sở dữ liệu,
/// sau khi khôi phục thành <see cref="NotificationData"/>, rồi đi qua bộ phân giải phía kênh và factory message,
/// để trả lời câu hỏi "sau khi lấy dữ liệu từ cơ sở dữ liệu thì có phân giải bình thường thành định dạng message kênh được không".
/// </para>
/// <para>
/// Điểm mấu chốt: giá trị phức tạp trong property bag là **chuỗi JSON** (chứ không phải đối tượng lồng nhau),
/// và discriminator <c>card_type</c> của thẻ mẫu phải được giữ lại, nếu không kiểu trừu tượng không thể khôi phục.
/// </para>
/// </remarks>
public class WeChatWorkDbJsonChannelData_Tests
    : AbpNotificationsWeChatWorkTestsBase
{
    private const string Provider = NotificationProviderNames.WechatWork;

    // ---------- 1. Thẻ mẫu (kiểu trừu tượng + discriminator) ----------

    /// <summary>
    /// JSON thẻ mẫu trong cơ sở dữ liệu (dạng escape, khớp với cách EF lưu)
    /// </summary>
    private const string TemplateCardDbJson =
        "{\"wx-work:template_card_message\":\"{" +
        "\\\"main_title\\\":{\\\"title\\\":\\\"Thông báo phê duyệt nghỉ phép\\\",\\\"desc\\\":\\\"Đơn xin nghỉ phép của bạn đã được phê duyệt\\\"}," +
        "\\\"sub_title_text\\\":\\\"Vui lòng xử lý kịp thời các công việc bàn giao tiếp theo\\\"," +
        "\\\"horizontal_content_list\\\":[{\\\"keyname\\\":\\\"Số đơn\\\",\\\"value\\\":\\\"LV20251001\\\"}]," +
        "\\\"TemplateCardCardAction\\\":{\\\"type\\\":1,\\\"url\\\":\\\"https://example.com/approval/123\\\"}," +
        "\\\"card_type\\\":\\\"template_card\\\"}\"}";

    [Fact]
    public void Should_Restore_TemplateCard_From_Db_Json()
    {
        var data = RestoreFromDbJson(TemplateCardDbJson);

        var payload = ChannelDataResolver.Resolve<WeChatWorkTemplateCardChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.TemplateCard.ShouldNotBeNull();

        // Lớp cơ sở trừu tượng phải có thể khôi phục thành kiểu thẻ cụ thể
        var card = payload.TemplateCard.ShouldBeOfType<TextTemplateCard>();
        card.MainTitle!.Title.ShouldBe("Thông báo phê duyệt nghỉ phép");
        card.MainTitle!.Description.ShouldBe("Đơn xin nghỉ phép của bạn đã được phê duyệt");
        card.SubTitle.ShouldBe("Vui lòng xử lý kịp thời các công việc bàn giao tiếp theo");
        card.CardAction.Url.ShouldBe("https://example.com/approval/123");

        // Danh sách lồng nhau cũng phải được khôi phục đầy đủ
        card.HorizontalContents.ShouldNotBeNull();
        card.HorizontalContents!.Count.ShouldBe(1);
        card.HorizontalContents[0].KeyName.ShouldBe("Số đơn");
        card.HorizontalContents[0].Value.ShouldBe("LV20251001");
    }

    // ---------- 2. Thẻ văn bản (kiểu cơ bản) ----------

    [Fact]
    public void Should_Restore_TextCard_From_Db_Json()
    {
        var data = RestoreFromDbJson(
            "{\"wx-work:text_card_message\":\"{" +
            "\\\"title\\\":\\\"Tiêu đề\\\",\\\"description\\\":\\\"Mô tả\\\"," +
            "\\\"url\\\":\\\"https://example.com\\\",\\\"btntxt\\\":\\\"Chi tiết\\\"}\"}");

        var payload = ChannelDataResolver.Resolve<WeChatWorkTextCardChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.TextCard.ShouldNotBeNull();
        payload.TextCard!.Title.ShouldBe("Tiêu đề");
        payload.TextCard!.Url.ShouldBe("https://example.com");
    }

    // ---------- 3. Tùy chọn gửi cùng tồn tại với dữ liệu kênh ----------

    [Fact]
    public void Should_Restore_Delivery_Options_Alongside_Channel_Data()
    {
        // Trong CSDL thực vừa có dữ liệu kênh, vừa có tùy chọn gửi (safe / khoảng kiểm tra trùng lặp, v.v.)
        var data = RestoreFromDbJson(
            "{\"wx-work:safe\":true,\"wx-work:duplicate_check_interval\":600," +
            "\"wx-work:text_card_message\":\"{" +
            "\\\"title\\\":\\\"Tiêu đề\\\",\\\"description\\\":\\\"Mô tả\\\",\\\"url\\\":\\\"https://example.com\\\"}\"}");

        ChannelDataResolver.Resolve<WeChatWorkTextCardChannelData>(data).ShouldNotBeNull();

        // Tùy chọn gửi là kiểu nguyên thủy, cần khôi phục đúng theo kiểu đã khai báo
        ChannelDataResolver.GetValue(data, WeChatWorkNotificationDataKeys.Safe, false).ShouldBeTrue();
        ChannelDataResolver.GetValue(data, WeChatWorkNotificationDataKeys.DuplicateCheckInterval, 0).ShouldBe(600);
    }

    // ---------- 4. Không phân giải nhầm khi không có dữ liệu kênh ----------

    [Fact]
    public void Should_Resolve_Nothing_When_Db_Json_Has_No_Channel_Data()
    {
        var data = RestoreFromDbJson(
            "{\"title\":\"Tiêu đề\",\"message\":\"Nội dung\",\"formUser\":\"ci\"}");

        ChannelDataResolver.Resolve(Provider, data).ShouldBeEmpty();
    }

    // ---------- 5. Hành vi khi payload không hợp lệ ----------

    [Fact]
    public void Should_Report_Declared_But_Resolve_Nothing_When_Db_Json_Payload_Is_Invalid()
    {
        // Dữ liệu kênh phức tạp được lưu dưới dạng chuỗi JSON, ở đây ghi nội dung không thể giải tuần tự hóa
        var data = RestoreFromDbJson(
            "{\"wx-work:template_card_message\":\"{ this is not json }\"}");

        // Hợp đồng: khóa thực sự tồn tại → IsDeclared là true; phân giải thất bại → Resolve trả về rỗng, không ném ngoại lệ
        ChannelDataResolver.IsDeclared(data, typeof(WeChatWorkTemplateCardChannelData)).ShouldBeTrue();
        ChannelDataResolver.Resolve(Provider, data).ShouldBeEmpty();

        // Thông tin chẩn đoán vẫn có thể cho biết khóa thực tế đã khớp, thuận tiện cho việc gỡ lỗi
        ChannelDataResolver.GetKey(data, typeof(WeChatWorkTemplateCardChannelData))
            .ShouldBe(WeChatWorkNotificationDataKeys.TemplateCardMessage);
    }

    // ---------- Hàm hỗ trợ ----------

    /// <summary>
    /// Mô phỏng việc khôi phục dữ liệu thông báo sau khi "lấy chuỗi JSON từ cơ sở dữ liệu"
    /// </summary>
    /// <remarks>
    /// Nhất quán với bộ chuyển đổi giá trị property bag của EF: toàn bộ property bag là một đối tượng JSON phẳng,
    /// dữ liệu kênh phức tạp trong đó được lưu dưới dạng <b>chuỗi JSON đã escape</b>.
    /// </remarks>
    private NotificationData RestoreFromDbJson(string dbJson)
    {
        var extraProperties = JsonSerializer.Deserialize<ExtraPropertyDictionary>(dbJson);

        return new NotificationData { ExtraProperties = extraProperties };
    }
}
