using LINGYUN.Abp.Notifications.Webhook.WeChat.Work;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Bộ đóng góp thông báo Webhook WeChat doanh nghiệp
/// </summary>
/// <remarks>
/// <para>
/// Ưu tiên phân giải **dữ liệu kênh (tải trọng)** do nhà sản xuất ghi, chỉ khi thiếu tải trọng mới quay lại suy ra theo
/// <see cref="NotificationInfo.ContentType"/>,
/// do đó hành vi của cách dùng cũ (chỉ ghi dữ liệu chuẩn) không thay đổi.
/// </para>
/// <para>
/// Một Webhook chỉ có thể mang một thông báo, vì vậy khi khai báo nhiều tải trọng thì lấy
/// tải trọng có <see cref="NotificationChannelDataAttribute.Priority"/> nhỏ nhất,
/// và xây dựng vật mang theo ánh xạ 1:1 —— không còn âm thầm loại bỏ loại nội dung không xác định như triển khai cũ.
/// </para>
/// </remarks>
public class WeChatWorkWebhookNotificationContributor : IWebhookNotificationContributor
{
    /// <summary>
    /// Tên bộ đóng góp (chỉ dùng cho nhật ký)
    /// </summary>
    public string Name => WeChatWorkWebhookNotificationProvider.ProviderName;

    public async virtual Task ContributeAsync(IWebhookNotificationContext context)
    {
        Check.NotNull(context, nameof(context));

        var options = context.ServiceProvider
            .GetRequiredService<IOptions<AbpNotificationsWebhookWeChatWorkOptions>>().Value;
        var messageOptions = context.ServiceProvider
            .GetRequiredService<IOptions<AbpNotificationsWebhookWeChatWorkMessageOptions>>().Value;
        var resolver = context.ServiceProvider
            .GetRequiredService<INotificationChannelDataResolver>();
        var notificationDataSerializer = context.ServiceProvider
            .GetRequiredService<INotificationDataSerializer>();

        var standardData = await notificationDataSerializer.ToStandard(context.Notification.Data);

        try
        {
            var payloads = resolver.Resolve(
                WeChatWorkWebhookNotificationProvider.ProviderName,
                context.Notification.Data);

            if (payloads.Count == 0)
            {
                // Quay lại: nhà sản xuất chưa ghi tải trọng, suy ra theo loại nội dung (giữ hành vi cũ)
                payloads = ResolveContentTypePayloads(
                    context.Notification.ContentType,
                    standardData.Message,
                    options);
            }

            if (payloads.Count == 0)
            {
                Logger(context).LogDebug(
                    "No wechat work webhook channel data was resolved for the notification: {name}, skip it.",
                    context.Notification.Name);

                return;
            }

            // Một Webhook chỉ có thể mang một thông báo: lấy phần tử đầu tiên theo Priority (kết quả phân giải đã được sắp xếp)
            var channelData = (WeChatWorkWebhookChannelData)payloads[0];

            ApplyStandardDataFallback(channelData, standardData);

            var message = messageOptions.Create(
                new WeChatWorkWebhookMessageFactoryContext(
                    context.Notification,
                    standardData,
                    channelData,
                    options));

            context.Webhook = new WebhookNotificationData(
                context.Notification.Name,
                message.Message);
            context.Handled = true;
        }
        catch (Exception ex)
        {
            Logger(context).LogWarning(
                "Failed to parse the content of the wechat work webhook message: {message}",
                ex.Message);
        }
    }

    /// <summary>
    /// Suy ra tải trọng theo loại nội dung thông báo (tương thích với nhà sản xuất cũ chưa ghi dữ liệu kênh)
    /// </summary>
    protected virtual IReadOnlyList<NotificationChannelData> ResolveContentTypePayloads(
        NotificationContentType contentType,
        string? message,
        AbpNotificationsWebhookWeChatWorkOptions options)
    {
        var content = message ?? string.Empty;

        switch (contentType)
        {
            case NotificationContentType.Text:
                return new NotificationChannelData[]
                {
                    new WeChatWorkWebhookTextChannelData { Content = content }
                };

            case NotificationContentType.Markdown:
                return options.UseMarkdownV2
                    ? new NotificationChannelData[]
                    {
                        new WeChatWorkWebhookMarkdownV2ChannelData { Content = content }
                    }
                    : new NotificationChannelData[]
                    {
                        new WeChatWorkWebhookMarkdownChannelData { Content = content }
                    };

            case NotificationContentType.Html:
                // HTML được chuyển thành markdown trước rồi mới gửi
                var markdown = CommonMark.CommonMarkConverter.Convert(content);

                return options.UseMarkdownV2
                    ? new NotificationChannelData[]
                    {
                        new WeChatWorkWebhookMarkdownV2ChannelData { Content = markdown }
                    }
                    : new NotificationChannelData[]
                    {
                        new WeChatWorkWebhookMarkdownChannelData { Content = markdown }
                    };

            default:
                return Array.Empty<NotificationChannelData>();
        }
    }

    /// <summary>
    /// Dùng dữ liệu chuẩn để bổ sung nội dung chưa được chỉ định trong tải trọng
    /// </summary>
    /// <remarks>
    /// Khi nhà sản xuất chỉ khai báo "dùng loại vật mang nào" mà không ghi nội dung (ví dụ chỉ ghi <c>wx-work-hook:markdown</c>),
    /// dùng nội dung thông báo đã được bản địa hóa/kết xuất xong, tránh gửi nội dung rỗng.
    /// </remarks>
    protected virtual void ApplyStandardDataFallback(
        WeChatWorkWebhookChannelData channelData,
        NotificationStandardData standardData)
    {
        if (standardData.Message.IsNullOrWhiteSpace())
        {
            return;
        }

        switch (channelData)
        {
            case WeChatWorkWebhookTextChannelData text when text.Content.IsNullOrWhiteSpace():
                text.Content = standardData.Message;
                break;

            case WeChatWorkWebhookMarkdownChannelData markdown when markdown.Content.IsNullOrWhiteSpace():
                markdown.Content = standardData.Message;
                break;

            case WeChatWorkWebhookMarkdownV2ChannelData markdownV2 when markdownV2.Content.IsNullOrWhiteSpace():
                markdownV2.Content = standardData.Message;
                break;
        }
    }

    private static ILogger Logger(IWebhookNotificationContext context)
    {
        return context.ServiceProvider.GetService<ILogger<WeChatWorkWebhookNotificationContributor>>()
            ?? NullLogger<WeChatWorkWebhookNotificationContributor>.Instance;
    }
}
