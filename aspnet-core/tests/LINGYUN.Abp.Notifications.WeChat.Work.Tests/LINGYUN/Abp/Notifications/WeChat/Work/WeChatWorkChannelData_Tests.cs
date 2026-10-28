using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Shouldly;
using System.Collections.Generic;
using Xunit;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Kiểm thử dữ liệu kênh tin nhắn ứng dụng WeChat Doanh nghiệp
/// </summary>
/// <remarks>
/// Cách viết thống nhất: trước tiên new đối tượng tin nhắn → qua <c>IJsonSerializer</c> tuần tự hóa ghi vào dữ liệu thông báo →
/// rồi dùng bộ phân tích phía kênh để xác thực kết quả khôi phục.
/// </remarks>
public class WeChatWorkChannelData_Tests : AbpNotificationsWeChatWorkTestsBase
{
    // ---------- Thẻ văn bản ----------

    [Fact]
    public void Should_Resolve_TextCard_Message()
    {
        var message = new TextCardMessage(
            title: "Đã phê duyệt",
            description: "Đơn xin nghỉ phép của bạn đã được phê duyệt",
            url: "https://example.com/leave/123",
            buttonText: "Đi xem");

        var payload = ChannelDataResolver.Resolve<WeChatWorkTextCardChannelData>(
            WriteChannelData(new WeChatWorkTextCardChannelData { TextCard = message }));

        payload.ShouldNotBeNull();
        payload!.TextCard.ShouldNotBeNull();

        // Tin nhắn được khôi phục phía kênh phải khớp từng trường với đối tượng mà bên sản xuất đã new ra
        payload.TextCard!.Title.ShouldBe(message.Title);
        payload.TextCard.Description.ShouldBe(message.Description);
        payload.TextCard.Url.ShouldBe(message.Url);
        payload.TextCard.ButtonText.ShouldBe(message.ButtonText);
    }

    [Fact]
    public void Should_Serialize_TextCard_By_Json_Contract()
    {
        var json = Serialize(new TextCardMessage("Tiêu đề", "Mô tả", "https://example.com"));

        // Hợp đồng tuần tự hóa: tên trường phải là snake_case mà WeChat Doanh nghiệp yêu cầu
        json.ShouldContain("\"title\"");
        json.ShouldContain("\"description\"");
        json.ShouldContain("\"url\"");
    }

    // ---------- Thông báo Mini Program ----------

    [Fact]
    public void Should_Resolve_MiniProgram_Message()
    {
        var message = new MiniProgramMessage(
            appId: "wx1234567890",
            title: "Đơn hàng đã gửi",
            page: "pages/order/detail?id=123",
            description: "Nhấn để xem chi tiết vận chuyển")
        {
            EmphasisFirstItem = true,
            ContentItems = new List<MiniProgramContent>
            {
                new MiniProgramContent("Số đơn hàng", "SO20251001001")
            }
        };

        var payload = ChannelDataResolver.Resolve<WeChatWorkMiniProgramNoticeChannelData>(
            WriteChannelData(new WeChatWorkMiniProgramNoticeChannelData { MiniProgram = message }));

        payload.ShouldNotBeNull();
        payload!.MiniProgram.ShouldNotBeNull();
        payload.MiniProgram!.AppId.ShouldBe("wx1234567890");
        payload.MiniProgram.Title.ShouldBe("Đơn hàng đã gửi");
        payload.MiniProgram.Page.ShouldBe("pages/order/detail?id=123");
        payload.MiniProgram.EmphasisFirstItem.ShouldBe(true);
        payload.MiniProgram.ContentItems.ShouldNotBeNull();
        payload.MiniProgram.ContentItems!.Count.ShouldBe(1);
        payload.MiniProgram.ContentItems[0].Key.ShouldBe("Số đơn hàng");
        payload.MiniProgram.ContentItems[0].Value.ShouldBe("SO20251001001");
    }

    // ---------- Tin nhắn hình ảnh-văn bản ----------

    [Fact]
    public void Should_Resolve_MpNew_Message()
    {
        var message = new MpNewMessagePayload(new List<MpNewMessage>
        {
            new MpNewMessage(
                title: "Báo cáo tháng",
                thumbMediaId: "MEDIA_ID",
                content: "<p>Nội dung chính của báo cáo</p>",
                author: "Bộ phận Vận hành",
                contentSourceUrl: "https://example.com/report",
                description: "Báo cáo kinh doanh tháng 10 năm 2025")
        });

        var payload = ChannelDataResolver.Resolve<WeChatWorkMpNewChannelData>(
            WriteChannelData(new WeChatWorkMpNewChannelData { MpNewMessage = message }));

        payload.ShouldNotBeNull();
        payload!.MpNewMessage.ShouldNotBeNull();
        payload.MpNewMessage!.Articles.Count.ShouldBe(1);

        var article = payload.MpNewMessage.Articles[0];
        article.Title.ShouldBe("Báo cáo tháng");
        article.ThumbMediaId.ShouldBe("MEDIA_ID");
        article.Content.ShouldBe("<p>Nội dung chính của báo cáo</p>");
        article.Author.ShouldBe("Bộ phận Vận hành");
        article.ContentSourceUrl.ShouldBe("https://example.com/report");
        article.Description.ShouldBe("Báo cáo kinh doanh tháng 10 năm 2025");
    }

    // ---------- Video / Âm thanh / Tệp ----------

    [Fact]
    public void Should_Resolve_Video_Message()
    {
        var message = new VideoMessage("MEDIA_ID", "Video đào tạo", "Đào tạo nhân viên mới vào làm");

        var payload = ChannelDataResolver.Resolve<WeChatWorkVideoChannelData>(
            WriteChannelData(new WeChatWorkVideoChannelData { Video = message }));

        payload.ShouldNotBeNull();
        payload!.Video.ShouldNotBeNull();
        payload.Video!.MediaId.ShouldBe("MEDIA_ID");
        payload.Video.Title.ShouldBe("Video đào tạo");
        payload.Video.Description.ShouldBe("Đào tạo nhân viên mới vào làm");
    }

    [Fact]
    public void Should_Resolve_Voice_Message()
    {
        var message = new MediaMessage("VOICE_MEDIA_ID");

        var payload = ChannelDataResolver.Resolve<WeChatWorkVoiceChannelData>(
            WriteChannelData(new WeChatWorkVoiceChannelData { Voice = message }));

        payload.ShouldNotBeNull();
        payload!.Voice.ShouldNotBeNull();
        payload.Voice!.MediaId.ShouldBe("VOICE_MEDIA_ID");
    }

    [Fact]
    public void Should_Resolve_File_Message()
    {
        var message = new MediaMessage("FILE_MEDIA_ID");

        var payload = ChannelDataResolver.Resolve<WeChatWorkFileChannelData>(
            WriteChannelData(new WeChatWorkFileChannelData { File = message }));

        payload.ShouldNotBeNull();
        payload!.File.ShouldNotBeNull();
        payload.File!.MediaId.ShouldBe("FILE_MEDIA_ID");
    }

    // ---------- Thẻ mẫu (đa hình kiểu trừu tượng) ----------

    [Fact]
    public void Should_Resolve_TemplateCard_Message()
    {
        var message = new TextTemplateCard(
            new TemplateCardCardAction("https://example.com/approval/123"))
        {
            MainTitle = new TemplateCardMainTitle("Thông báo phê duyệt nghỉ phép", "Đơn xin nghỉ phép của bạn đã được phê duyệt"),
            SubTitle = "Vui lòng xử lý kịp thời các việc bàn giao tiếp theo"
        };

        var payload = ChannelDataResolver.Resolve<WeChatWorkTemplateCardChannelData>(
            WriteChannelData(new WeChatWorkTemplateCardChannelData { TemplateCard = message }));

        payload.ShouldNotBeNull();
        payload!.TemplateCard.ShouldNotBeNull();

        // Lớp cơ sở trừu tượng phải có thể khôi phục thành kiểu thẻ cụ thể
        payload.TemplateCard.ShouldBeOfType<TextTemplateCard>();

        var card = (TextTemplateCard)payload.TemplateCard!;
        card.MainTitle!.Title.ShouldBe("Thông báo phê duyệt nghỉ phép");
        card.SubTitle.ShouldBe("Vui lòng xử lý kịp thời các việc bàn giao tiếp theo");
        card.CardAction.Url.ShouldBe("https://example.com/approval/123");
    }

    // ---------- Tùy chọn phân phối và payload cùng tồn tại ----------

    [Fact]
    public void Should_Resolve_Payload_Along_With_Delivery_Options()
    {
        var data = WriteChannelData(new WeChatWorkTextCardChannelData
        {
            TextCard = new TextCardMessage("Tiêu đề", "Mô tả", "https://example.com")
        });

        data.TrySetData(WeChatWorkNotificationDataKeys.Safe, true);
        data.TrySetData(WeChatWorkNotificationDataKeys.ToParty, "1|2");
        data.TrySetData(WeChatWorkNotificationDataKeys.DuplicateCheckInterval, 600);

        // Payload
        ChannelDataResolver.Resolve<WeChatWorkTextCardChannelData>(data).ShouldNotBeNull();

        // Tùy chọn vô hướng
        ChannelDataResolver.GetValue(data, WeChatWorkNotificationDataKeys.Safe, false).ShouldBeTrue();
        ChannelDataResolver.GetValue(data, WeChatWorkNotificationDataKeys.DuplicateCheckInterval, 1800)
            .ShouldBe(600);
        ChannelDataResolver.GetOrNull(data, WeChatWorkNotificationDataKeys.ToParty).ShouldBe("1|2");
    }

    [Fact]
    public void Should_Require_Only_Its_Own_Key_To_Be_Declared()
    {
        // Chỉ ghi một khóa payload, không được khớp nhầm sang kiểu payload khác
        var data = WriteChannelData(new WeChatWorkVideoChannelData
        {
            Video = new VideoMessage("MEDIA_ID")
        });

        ChannelDataResolver.IsDeclared(data, typeof(WeChatWorkVideoChannelData)).ShouldBeTrue();
        ChannelDataResolver.IsDeclared(data, typeof(WeChatWorkTextCardChannelData)).ShouldBeFalse();
        ChannelDataResolver.IsDeclared(data, typeof(WeChatWorkFileChannelData)).ShouldBeFalse();
        ChannelDataResolver.IsDeclared(data, typeof(WeChatWorkTemplateCardChannelData)).ShouldBeFalse();
    }

    // ---------- Nhiều payload cùng tồn tại: sắp xếp theo Priority ----------

    [Fact]
    public void Should_Resolve_All_Payloads_In_Priority_Order()
    {
        var data = WriteChannelData(new WeChatWorkTextCardChannelData
        {
            TextCard = new TextCardMessage("Tiêu đề", "Mô tả", "https://example.com")
        });
        // Hợp nhất thêm một payload khác (khóa khác nhau, không xung đột lẫn nhau)
        MergeChannelData(data, new WeChatWorkMiniProgramNoticeChannelData
        {
            MiniProgram = new MiniProgramMessage("appid", "Tiêu đề")
        });

        var payloads = ChannelDataResolver.Resolve(
            WeChatWorkNotificationPublishProvider.ProviderName,
            data);

        payloads.Count.ShouldBe(2);
        // Priority: thông báo Mini Program 100 < thẻ văn bản 400
        payloads[0].ShouldBeOfType<WeChatWorkMiniProgramNoticeChannelData>();
        payloads[1].ShouldBeOfType<WeChatWorkTextCardChannelData>();
    }

    [Fact]
    public void Should_Declare_Every_Registered_Payload_Kind()
    {
        var types = ChannelDataResolver.GetPayloadTypes(WeChatWorkNotificationPublishProvider.ProviderName);

        types.Count.ShouldBe(7);
        types.ShouldContain(typeof(WeChatWorkMiniProgramNoticeChannelData));
        types.ShouldContain(typeof(WeChatWorkMpNewChannelData));
        types.ShouldContain(typeof(WeChatWorkTemplateCardChannelData));
        types.ShouldContain(typeof(WeChatWorkTextCardChannelData));
        types.ShouldContain(typeof(WeChatWorkVideoChannelData));
        types.ShouldContain(typeof(WeChatWorkVoiceChannelData));
        types.ShouldContain(typeof(WeChatWorkFileChannelData));
    }
}
