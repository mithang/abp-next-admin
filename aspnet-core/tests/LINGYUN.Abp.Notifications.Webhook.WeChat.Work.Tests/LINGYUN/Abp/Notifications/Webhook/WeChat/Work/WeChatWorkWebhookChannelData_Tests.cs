using LINGYUN.Abp.WeChat.Work.Messages;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Shouldly;
using System.Collections.Generic;
using Xunit;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Kiểm thử dữ liệu kênh Webhook WeChat Doanh nghiệp
/// </summary>
/// <remarks>
/// Cách viết thống nhất: trước tiên new đối tượng message → tuần tự hóa qua <c>IJsonSerializer</c> rồi ghi vào dữ liệu thông báo →
/// sau đó dùng bộ phân giải phía kênh + factory message để xác minh carrier cuối cùng.
/// </remarks>
public class WeChatWorkWebhookChannelData_Tests : AbpNotificationsWebhookWeChatWorkTestsBase
{
    private const string Provider = WeChatWorkWebhookNotificationProvider.ProviderName;

    private AbpNotificationsWebhookWeChatWorkMessageOptions MessageOptions
        => GetRequiredService<IOptions<AbpNotificationsWebhookWeChatWorkMessageOptions>>().Value;

    private AbpNotificationsWebhookWeChatWorkOptions ChannelOptions
        => GetRequiredService<IOptions<AbpNotificationsWebhookWeChatWorkOptions>>().Value;

    // ---------- 1. Phân giải + cấu tạo carrier (đầu cuối) ----------

    [Fact]
    public void Should_Resolve_Text_Payload_And_Build_Text_Message()
    {
        var data = WriteChannelData(new WeChatWorkWebhookTextChannelData
        {
            Content = "Bản build #1234 thất bại"
        });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookTextChannelData>(data);
        payload.ShouldNotBeNull();
        payload!.Content.ShouldBe("Bản build #1234 thất bại");

        var message = BuildMessage(payload);
        message.MsgType.ShouldBe("text");

        var text = message.ShouldBeOfType<WeChatWorkWebhookTextMessage>();
        text.Text.Content.ShouldBe("Bản build #1234 thất bại");
    }

    [Fact]
    public void Should_Resolve_Markdown_Payload_And_Build_Markdown_Message()
    {
        var data = WriteChannelData(new WeChatWorkWebhookMarkdownChannelData
        {
            Content = "**Bản build thất bại**"
        });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookMarkdownChannelData>(data);
        payload.ShouldNotBeNull();

        var message = BuildMessage(payload!);
        message.MsgType.ShouldBe("markdown");
        message.ShouldBeOfType<WeChatWorkWebhookMarkdownMessage>()
            .Markdown.Content.ShouldBe("**Bản build thất bại**");
    }

    [Fact]
    public void Should_Resolve_MarkdownV2_Payload_And_Build_MarkdownV2_Message()
    {
        var data = WriteChannelData(new WeChatWorkWebhookMarkdownV2ChannelData
        {
            Content = "| a | b |\n|---|---|\n| 1 | 2 |"
        });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookMarkdownV2ChannelData>(data);
        payload.ShouldNotBeNull();

        var message = BuildMessage(payload!);
        message.MsgType.ShouldBe("markdown_v2");
        message.ShouldBeOfType<WeChatWorkWebhookMarkdownV2Message>()
            .Markdown.Content.ShouldContain("| a | b |");
    }

    [Fact]
    public void Should_Resolve_Image_Payload_And_Build_Image_Message()
    {
        var image = new WebhookImageMessage("BASE64_DATA", "MD5_HASH");

        var data = WriteChannelData(new WeChatWorkWebhookImageChannelData { Image = image });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookImageChannelData>(data);
        payload.ShouldNotBeNull();
        payload!.Image.ShouldNotBeNull();
        payload.Image!.Base64.ShouldBe("BASE64_DATA");
        payload.Image.Md5.ShouldBe("MD5_HASH");

        var message = BuildMessage(payload);
        message.MsgType.ShouldBe("image");
        message.ShouldBeOfType<WeChatWorkWebhookImageMessage>()
            .Image.Base64.ShouldBe("BASE64_DATA");
    }

    [Fact]
    public void Should_Resolve_News_Payload_And_Build_News_Message()
    {
        var news = new WebhookNewsMessage(new List<WebhookArticleMessage>
        {
            new WebhookArticleMessage(
                title: "Báo cáo tháng",
                url: "https://example.com/report",
                description: "Tháng 10 năm 2025",
                pictureUrl: "https://example.com/cover.png")
        });

        var data = WriteChannelData(new WeChatWorkWebhookNewsChannelData { News = news });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookNewsChannelData>(data);
        payload.ShouldNotBeNull();
        payload!.News.ShouldNotBeNull();
        payload.News!.Articles.Count.ShouldBe(1);
        payload.News.Articles[0].Title.ShouldBe("Báo cáo tháng");
        payload.News.Articles[0].Url.ShouldBe("https://example.com/report");
        payload.News.Articles[0].PictureUrl.ShouldBe("https://example.com/cover.png");

        var message = BuildMessage(payload);
        message.MsgType.ShouldBe("news");

        // Carrier này trước đây không thể dùng được vì WeChatWorkWebhookNewsMessage là internal
        var newsMessage = message.ShouldBeOfType<WeChatWorkWebhookNewsMessage>();
        newsMessage.News.Articles[0].Title.ShouldBe("Báo cáo tháng");
    }

    [Fact]
    public void Should_Resolve_File_Payload_And_Build_File_Message()
    {
        var data = WriteChannelData(new WeChatWorkWebhookFileChannelData
        {
            File = new WebhookFileMessage("FILE_MEDIA_ID")
        });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookFileChannelData>(data);
        payload.ShouldNotBeNull();

        var message = BuildMessage(payload!);
        message.MsgType.ShouldBe("file");
        message.ShouldBeOfType<WeChatWorkWebhookFileMessage>()
            .File.MediaId.ShouldBe("FILE_MEDIA_ID");
    }

    [Fact]
    public void Should_Resolve_Voice_Payload_And_Build_Voice_Message()
    {
        var data = WriteChannelData(new WeChatWorkWebhookVoiceChannelData
        {
            Voice = new WebhookVoiceMessage("VOICE_MEDIA_ID")
        });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookVoiceChannelData>(data);
        payload.ShouldNotBeNull();

        var message = BuildMessage(payload!);
        message.MsgType.ShouldBe("voice");
        message.ShouldBeOfType<WeChatWorkWebhookVoiceMessage>()
            .Voice.MediaId.ShouldBe("VOICE_MEDIA_ID");
    }

    // ---------- 2. Thẻ mẫu (đa hình kiểu trừu tượng) ----------

    [Fact]
    public void Should_Resolve_TextNoticeCard_And_Build_TemplateCard_Message()
    {
        var card = new WebhookTextNoticeCardMessage(
            action: WebhookTemplateCardAction.Link("https://example.com/build/1234"),
            mainTitle: new WebhookTemplateCardMainTitle("Bản build thất bại", "Vui lòng xử lý kịp thời"),
            subTitleText: "Bản build #1234 thất bại lúc 15:30",
            horizontalContents: new List<WebhookTemplateCardHorizontalContent>
            {
                WebhookTemplateCardHorizontalContent.Default("Nhánh", "main")
            });

        var data = WriteChannelData(new WeChatWorkWebhookTemplateCardChannelData { TemplateCard = card });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookTemplateCardChannelData>(data);
        payload.ShouldNotBeNull();
        payload!.TemplateCard.ShouldNotBeNull();

        // Lớp cơ sở trừu tượng phải được khôi phục thành kiểu thẻ cụ thể
        var restored = payload.TemplateCard.ShouldBeOfType<WebhookTextNoticeCardMessage>();
        restored.CardType.ShouldBe("text_notice");
        restored.SubTitleText.ShouldBe("Bản build #1234 thất bại lúc 15:30");
        restored.Action!.Url.ShouldBe("https://example.com/build/1234");
        restored.MainTitle!.Title.ShouldBe("Bản build thất bại");
        restored.HorizontalContents!.Count.ShouldBe(1);

        var message = BuildMessage(payload);
        message.MsgType.ShouldBe("template_card");
        message.ShouldBeOfType<WeChatWorkWebhookTemplateCardMessage>()
            .TemplateCard.ShouldBeOfType<WebhookTextNoticeCardMessage>();
    }

    [Fact]
    public void Should_Resolve_NewsNoticeCard()
    {
        var card = new WebhookNewsNoticeCardMessage(
            cardImage: new WebhookTemplateCardImage("https://example.com/pic.png"),
            action: WebhookTemplateCardAction.Link("https://example.com"),
            mainTitle: new WebhookTemplateCardMainTitle("Thẻ hình ảnh và văn bản", null));

        var data = WriteChannelData(new WeChatWorkWebhookTemplateCardChannelData { TemplateCard = card });

        var payload = ChannelDataResolver.Resolve<WeChatWorkWebhookTemplateCardChannelData>(data);

        var restored = payload!.TemplateCard.ShouldBeOfType<WebhookNewsNoticeCardMessage>();
        restored.CardType.ShouldBe("news_notice");
        restored.CardImage.Url.ShouldBe("https://example.com/pic.png");
    }

    [Fact]
    public void Should_Serialize_Card_With_CardType_Discriminator()
    {
        var json = Serialize(new WebhookTextNoticeCardMessage(
            WebhookTemplateCardAction.Link("https://example.com"),
            new WebhookTemplateCardMainTitle("Tiêu đề", "Tiêu đề phụ")));

        // Discriminator là bắt buộc để khôi phục kiểu cụ thể
        json.ShouldContain("card_type");
        json.ShouldContain("text_notice");
    }

    // ---------- 3. Cách ly kênh ----------

    [Fact]
    public void Should_Not_Share_Keys_With_App_Message_Channel()
    {
        var data = WriteChannelData(new WeChatWorkWebhookTextChannelData { Content = "hello" });

        // Kênh message ứng dụng không được khớp với payload có tiền tố Webhook
        ChannelDataResolver
            .Resolve<LINGYUN.Abp.Notifications.WeChat.Work.WeChatWorkTextCardChannelData>(data)
            .ShouldBeNull();
        ChannelDataResolver
            .IsDeclared(data, typeof(LINGYUN.Abp.Notifications.WeChat.Work.WeChatWorkTextCardChannelData))
            .ShouldBeFalse();
    }

    [Fact]
    public void Should_Use_Its_Own_Provider_Name()
    {
        Provider.ShouldNotBe(
            LINGYUN.Abp.Notifications.WeChat.Work.WeChatWorkNotificationPublishProvider.ProviderName);
        WeChatWorkWebhookNotificationDataKeys.Prefix.ShouldNotBe(
            LINGYUN.Abp.Notifications.WeChat.Work.WeChatWorkNotificationDataKeys.Prefix);
    }

    // ---------- 4. Đăng ký và factory ----------

    [Fact]
    public void Should_Register_All_Eight_Payloads()
    {
        var types = ChannelDataResolver.GetPayloadTypes(Provider);

        types.Count.ShouldBe(8);
        types.ShouldContain(typeof(WeChatWorkWebhookTextChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookMarkdownChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookMarkdownV2ChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookImageChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookNewsChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookFileChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookVoiceChannelData));
        types.ShouldContain(typeof(WeChatWorkWebhookTemplateCardChannelData));
    }

    [Fact]
    public void Should_Map_Every_Payload_Kind_To_Its_Own_MsgType()
    {
        var expected = new (NotificationChannelData Payload, string MsgType)[]
        {
            (new WeChatWorkWebhookTextChannelData { Content = "t" }, "text"),
            (new WeChatWorkWebhookMarkdownChannelData { Content = "m" }, "markdown"),
            (new WeChatWorkWebhookMarkdownV2ChannelData { Content = "m2" }, "markdown_v2"),
            (new WeChatWorkWebhookImageChannelData { Image = new WebhookImageMessage("b", "m") }, "image"),
            (new WeChatWorkWebhookNewsChannelData
            {
                News = new WebhookNewsMessage(new List<WebhookArticleMessage>
                {
                    new WebhookArticleMessage("Tiêu đề", "https://example.com")
                })
            }, "news"),
            (new WeChatWorkWebhookFileChannelData { File = new WebhookFileMessage("M") }, "file"),
            (new WeChatWorkWebhookVoiceChannelData { Voice = new WebhookVoiceMessage("M") }, "voice"),
            (new WeChatWorkWebhookTemplateCardChannelData
            {
                TemplateCard = new WebhookTextNoticeCardMessage(
                    WebhookTemplateCardAction.Link("https://example.com"),
                    new WebhookTemplateCardMainTitle("Tiêu đề", "Tiêu đề phụ"))
            }, "template_card"),
        };

        foreach (var (payload, msgType) in expected)
        {
            BuildMessage(payload).MsgType.ShouldBe(msgType);
        }

        MessageOptions.MessageKinds.Count.ShouldBe(8);
    }

    // ---------- 5. Tùy chọn và mức ưu tiên ----------

    [Fact]
    public void Should_Enable_MarkdownV2_By_Default()
    {
        ChannelOptions.UseMarkdownV2.ShouldBeTrue();
    }

    [Fact]
    public void Should_Resolve_Payloads_In_Priority_Order()
    {
        var data = WriteChannelData(new WeChatWorkWebhookTemplateCardChannelData
        {
            TemplateCard = new WebhookTextNoticeCardMessage(
                WebhookTemplateCardAction.Link("https://example.com"),
                new WebhookTemplateCardMainTitle("Tiêu đề", "Tiêu đề phụ"))
        });
        MergeChannelData(data, new WeChatWorkWebhookTextChannelData { Content = "text" });

        var payloads = ChannelDataResolver.Resolve(Provider, data);

        payloads.Count.ShouldBe(2);
        // Priority: văn bản 100 < thẻ mẫu 800
        payloads[0].ShouldBeOfType<WeChatWorkWebhookTextChannelData>();
        payloads[1].ShouldBeOfType<WeChatWorkWebhookTemplateCardChannelData>();
    }

    // ---------- Hàm hỗ trợ ----------

    private WeChatWorkWebhookMessage BuildMessage(NotificationChannelData payload)
    {
        return MessageOptions.Create(new WeChatWorkWebhookMessageFactoryContext(
            new NotificationInfo { Name = "Test", ContentType = NotificationContentType.Text },
            new NotificationStandardData("Tiêu đề", "Nội dung"),
            (WeChatWorkWebhookChannelData)payload,
            ChannelOptions)).Message;
    }
}
