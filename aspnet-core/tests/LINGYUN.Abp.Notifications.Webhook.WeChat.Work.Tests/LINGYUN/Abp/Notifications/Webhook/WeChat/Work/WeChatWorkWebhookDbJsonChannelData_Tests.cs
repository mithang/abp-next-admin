using LINGYUN.Abp.WeChat.Work.Messages;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Microsoft.Extensions.Options;
using Shouldly;
using System;
using System.Collections.Generic;
using Volo.Abp.Data;
using Xunit;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Kiểm thử phân tích dữ liệu kênh từ chuỗi JSON cơ sở dữ liệu
/// </summary>
/// <remarks>
/// <para>
/// Các kiểm thử trước đều là đường cùng tiến trình "ghi trong bộ nhớ → đọc", không kiểm chứng được vòng lặp lưu trữ.
/// Nhóm kiểm thử này bổ sung **liên kết thật**: trực tiếp đưa ra chuỗi JSON lưu trong cơ sở dữ liệu,
/// khôi phục thành <see cref="NotificationData"/> rồi đi qua phân tích phía kênh và nhà máy tin nhắn,
/// trả lời câu hỏi "sau khi lấy dữ liệu từ cơ sở dữ liệu có phân tích bình thường thành định dạng tin nhắn kênh được không".
/// </para>
/// <para>
/// Điểm then chốt: giá trị trong gói thuộc tính sau khi lưu trữ là **chuỗi JSON** (không phải đối tượng lồng nhau),
/// và dấu phân biệt <c>card_type</c> của thẻ mẫu phải được giữ lại, nếu không kiểu trừu tượng không thể khôi phục.
/// </para>
/// </remarks>
public class WeChatWorkWebhookDbJsonChannelData_Tests
    : AbpNotificationsWebhookWeChatWorkTestsBase
{
    private const string Provider = WeChatWorkWebhookNotificationProvider.ProviderName;

    private AbpNotificationsWebhookWeChatWorkMessageOptions MessageOptions
        => GetRequiredService<IOptions<AbpNotificationsWebhookWeChatWorkMessageOptions>>().Value;

    private AbpNotificationsWebhookWeChatWorkOptions ChannelOptions
        => GetRequiredService<IOptions<AbpNotificationsWebhookWeChatWorkOptions>>().Value;

    // ---------- 1. Thẻ mẫu (kiểu trừu tượng + dấu phân biệt) ----------

    /// <summary>
    /// JSON thẻ mẫu trong cơ sở dữ liệu (dạng đã thoát ký tự, nhất quán với cách EF lưu)
    /// </summary>
    private const string TemplateCardDbJson =
        "{" +
        "\"wx-work-hook:template_card\":\"{\\\"sub_title_text\\\":\\\"Vui lòng xem nhật ký\\\"," +
        "\\\"card_type\\\":\\\"text_notice\\\"," +
        "\\\"main_title\\\":{\\\"title\\\":\\\"Xây dựng thất bại\\\",\\\"desc\\\":\\\"Xây dựng #1234 thất bại\\\"}," +
        "\\\"horizontal_content_list\\\":[{\\\"keyname\\\":\\\"Nhánh\\\",\\\"value\\\":\\\"main\\\"}]," +
        "\\\"card_action\\\":{\\\"type\\\":1,\\\"url\\\":\\\"https://example.com/build/1\\\"}}\"" +
        "}";

    [Fact]
    public void Should_Restore_TemplateCard_From_Db_Json()
    {
        var data = RestoreFromDbJson(TemplateCardDbJson);

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookTemplateCardChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.TemplateCard.ShouldNotBeNull();

        // Kiểu trừu tượng được khôi phục thành kiểu cụ thể theo card_type
        var card = payload.TemplateCard.ShouldBeOfType<WebhookTextNoticeCardMessage>();
        card.CardType.ShouldBe("text_notice");
        card.MainTitle!.Title.ShouldBe("Xây dựng thất bại");
        card.MainTitle!.Description.ShouldBe("Xây dựng #1234 thất bại");
        card.SubTitleText.ShouldBe("Vui lòng xem nhật ký");
        card.Action!.Url.ShouldBe("https://example.com/build/1");

        // Danh sách lồng nhau cũng phải được khôi phục đầy đủ
        card.HorizontalContents.ShouldNotBeNull();
        card.HorizontalContents!.Count.ShouldBe(1);
        card.HorizontalContents[0].KeyName.ShouldBe("Nhánh");
        card.HorizontalContents[0].Value.ShouldBe("main");
    }

    [Fact]
    public void Should_Build_TemplateCard_Message_From_Db_Json()
    {
        var data = RestoreFromDbJson(TemplateCardDbJson);

        var message = BuildMessage(Provider, data);

        message.MsgType.ShouldBe("template_card");

        var card = message.ShouldBeOfType<WeChatWorkWebhookTemplateCardMessage>();
        card.TemplateCard.ShouldBeOfType<WebhookTextNoticeCardMessage>()
            .MainTitle!.Title.ShouldBe("Xây dựng thất bại");
    }

    // ---------- 2. Payload vô hướng ----------

    private const string TextDbJson =
        "{\"wx-work-hook:text\":\"Xây dựng #1234 thất bại\"}";

    [Fact]
    public void Should_Restore_Text_From_Db_Json()
    {
        var data = RestoreFromDbJson(TextDbJson);

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookTextChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.Content.ShouldBe("Xây dựng #1234 thất bại");

        BuildMessage(Provider, data)
            .ShouldBeOfType<WeChatWorkWebhookTextMessage>()
            .Text.Content.ShouldBe("Xây dựng #1234 thất bại");
    }

    // ---------- 3. Tham số cơ bản và dữ liệu kênh cùng tồn tại ----------

    [Fact]
    public void Should_Restore_Standard_Data_Alongside_Channel_Data()
    {
        // Trong thư viện thật vừa có tham số cơ bản của thông báo, vừa có dữ liệu kênh
        var data = RestoreFromDbJson(
            "{\"title\":\"Xây dựng thất bại\",\"message\":\"Xây dựng #1234 thất bại\",\"formUser\":\"ci\"," +
            "\"wx-work-hook:text\":\"Văn bản dự phòng\"}");

        data.TryGetData("title").ShouldBe("Xây dựng thất bại");
        data.TryGetData("formUser").ShouldBe("ci");

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookTextChannelData>(data);
        payload.ShouldNotBeNull();
        payload!.Content.ShouldBe("Văn bản dự phòng");
    }

    // ---------- 4. Khi không có dữ liệu kênh thì không phân tích nhầm ----------

    [Fact]
    public void Should_Resolve_Nothing_When_Db_Json_Has_No_Channel_Data()
    {
        var data = RestoreFromDbJson(
            "{\"title\":\"Xây dựng thất bại\",\"message\":\"Xây dựng #1234 thất bại\"}");

        ChannelDataResolver.Resolve(Provider, data).ShouldBeEmpty();
    }

    // ---------- 5. Hành vi khi payload không hợp lệ ----------

    [Fact]
    public void Should_Report_Declared_But_Resolve_Nothing_When_Db_Json_Payload_Is_Invalid()
    {
        // JSON thẻ mẫu thiếu dấu phân biệt card_type, kiểu trừu tượng không thể khôi phục
        var data = RestoreFromDbJson(
            "{\"wx-work-hook:template_card\":\"{\\\"main_title\\\":{\\\"title\\\":\\\"t\\\"}}\"}");

        // Hợp đồng: bên sản xuất thực sự đã ghi khóa đó → IsDeclared là true,
        // nhưng phân tích thất bại → Resolve trả về rỗng (chỉ ghi nhật ký), không ném ngoại lệ
        ChannelDataResolver.IsDeclared(data, typeof(WeChatWorkWebhookTemplateCardChannelData)).ShouldBeTrue();
        ChannelDataResolver.Resolve(Provider, data).ShouldBeEmpty();

        // Thông tin chẩn đoán vẫn có thể đưa ra khóa thực tế đã khớp, thuận tiện cho việc tra soát
        ChannelDataResolver.GetKey(data, typeof(WeChatWorkWebhookTemplateCardChannelData))
            .ShouldBe(WeChatWorkWebhookNotificationDataKeys.TemplateCard);
    }

    // ---------- Hỗ trợ ----------

    /// <summary>
    /// Mô phỏng việc khôi phục dữ liệu thông báo sau khi "lấy chuỗi JSON từ cơ sở dữ liệu"
    /// </summary>
    /// <remarks>
    /// Nhất quán với bộ chuyển đổi giá trị gói thuộc tính của EF: toàn bộ gói thuộc tính là một đối tượng JSON phẳng,
    /// dữ liệu kênh phức tạp trong đó được lưu dưới dạng <b>chuỗi JSON đã thoát ký tự</b>.
    /// </remarks>
    private NotificationData RestoreFromDbJson(string dbJson)
    {
        var extraProperties = JsonSerializer.Deserialize<ExtraPropertyDictionary>(dbJson);

        return new NotificationData { ExtraProperties = extraProperties };
    }

    private WeChatWorkWebhookMessage BuildMessage(string provider, NotificationData data)
    {
        var payload = ChannelDataResolver.Resolve(provider, data);
        payload.ShouldNotBeEmpty();

        return MessageOptions.Create(new WeChatWorkWebhookMessageFactoryContext(
            new NotificationInfo { Name = "Test", ContentType = NotificationContentType.Text },
            new NotificationStandardData("Tiêu đề", "Nội dung"),
            (WeChatWorkWebhookChannelData)payload[0],
            ChannelOptions)).Message;
    }
}
