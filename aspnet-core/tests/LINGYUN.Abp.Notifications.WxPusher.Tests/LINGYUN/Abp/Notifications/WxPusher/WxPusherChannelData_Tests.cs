using Shouldly;
using System;
using System.Threading.Tasks;
using Xunit;

namespace LINGYUN.Abp.Notifications.WxPusher;

/// <summary>
/// Kiểm thử dữ liệu kênh WxPusher
/// </summary>
/// <remarks>
/// Cách viết thống nhất: trước tiên new dữ liệu kênh → qua <c>IJsonSerializer</c> tuần tự hóa ghi vào dữ liệu thông báo →
/// sau đó để kênh thực sự phát hành, assert các tham số tin nhắn đã bắt được.
/// </remarks>
public class WxPusherChannelData_Tests : AbpNotificationsWxPusherTestBase
{
    private const string Provider = WxPusherNotificationPublishProvider.ProviderName;

    private FakeWxPusherMessageSender Sender
        => (FakeWxPusherMessageSender)GetRequiredService<LINGYUN.Abp.WxPusher.Messages.IWxPusherMessageSender>();

    [Fact]
    public void Should_Resolve_Url()
    {
        var data = WriteChannelData(new WxPusherChannelData
        {
            Url = "https://example.com/detail/123"
        });

        var payload = ChannelDataResolver.Resolve<WxPusherChannelData>(data);

        payload.ShouldNotBeNull();
        payload!.Url.ShouldBe("https://example.com/detail/123");
    }

    [Fact]
    public void Should_Not_Declare_Payload_When_Url_Absent()
    {
        ChannelDataResolver.IsDeclared(new NotificationData(), typeof(WxPusherChannelData))
            .ShouldBeFalse();
    }

    [Fact]
    public void Should_Match_Key_Case_Insensitively()
    {
        var data = new NotificationData();
        data.TrySetData(WxPusherNotificationDataKeys.Url, "https://example.com/a");

        ChannelDataResolver.Resolve<WxPusherChannelData>(data)!.Url
            .ShouldBe("https://example.com/a");

        var upper = new NotificationData();
        upper.TrySetData("WX-PUSHER:URL", "https://example.com/b");

        ChannelDataResolver.Resolve<WxPusherChannelData>(upper)!.Url
            .ShouldBe("https://example.com/b");
    }

    [Fact]
    public async Task Should_Send_With_Resolved_Url()
    {
        Sender.Clear();

        var data = WriteChannelData(new WxPusherChannelData
        {
            Url = "https://example.com/from-channel-data"
        });
        data.WriteStandardData("Tiêu đề", "Nội dung", DateTime.Now, "system");

        await PublishAsync(data);

        Sender.SentMessages.Count.ShouldBe(1);
        Sender.SentMessages[0].Url.ShouldBe("https://example.com/from-channel-data");
        Sender.SentMessages[0].Content.ShouldBe("Nội dung");
        Sender.SentMessages[0].Summary.ShouldBe("Tiêu đề");
    }

    [Fact]
    public async Task Should_Send_Without_Url_When_Not_Provided()
    {
        Sender.Clear();

        var data = new NotificationData();
        data.WriteStandardData("Tiêu đề", "Nội dung", DateTime.Now, "system");

        await PublishAsync(data);

        Sender.SentMessages.Count.ShouldBe(1);
        Sender.SentMessages[0].Url.ShouldBeNull();
    }

    private async Task PublishAsync(NotificationData data)
    {
        var provider = GetRequiredService<WxPusherNotificationPublishProvider>();

        var notification = new NotificationInfo
        {
            Name = "Test",
            ContentType = NotificationContentType.Text,
            Data = data
        };
        notification.SetId(1);

        var context = new NotificationPublishContext(
            notification,
            new[] { new UserIdentifier(Guid.NewGuid(), "tester") });

        await provider.PublishAsync(context);
    }
}
