using LINGYUN.Abp.WeChat.Work.Messages;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Factory tin nhắn Webhook WeChat doanh nghiệp
/// </summary>
public static class WeChatWorkWebhookMessageFactory
{
    /// <summary>
    /// Đăng ký các factory tin nhắn tích hợp sẵn
    /// </summary>
    /// <remarks>
    /// Mỗi loại payload tương ứng với một <c>msgtype</c>, ánh xạ một-một, không tự động hạ cấp ngầm:
    /// Nếu producer đã chọn thẻ mẫu thì nhất định sẽ gửi thẻ mẫu, chứ không âm thầm gửi thành văn bản.
    /// Ngoại lệ duy nhất là lựa chọn giữa markdown và markdown_v2, do tùy chọn của kênh
    /// <see cref="AbpNotificationsWebhookWeChatWorkOptions.UseMarkdownV2"/> quyết định.
    /// </remarks>
    public static AbpNotificationsWebhookWeChatWorkMessageOptions MapDefaultMessageFactories(
        this AbpNotificationsWebhookWeChatWorkMessageOptions options)
    {
        Check.NotNull(options, nameof(options));

        return options
            .Map(WeChatWorkWebhookMessageKind.Text, context =>
            {
                var payload = (WeChatWorkWebhookTextChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookTextMessage(new WebhookTextMessage(payload.Content!)),
                    WeChatWorkWebhookMessageKind.Text);
            })
            .Map(WeChatWorkWebhookMessageKind.Markdown, context =>
            {
                var payload = (WeChatWorkWebhookMarkdownChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookMarkdownMessage(new WebhookMarkdownMessage(payload.Content!)),
                    WeChatWorkWebhookMessageKind.Markdown);
            })
            .Map(WeChatWorkWebhookMessageKind.MarkdownV2, context =>
            {
                var payload = (WeChatWorkWebhookMarkdownV2ChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookMarkdownV2Message(new WebhookMarkdownV2Message(payload.Content!)),
                    WeChatWorkWebhookMessageKind.MarkdownV2);
            })
            .Map(WeChatWorkWebhookMessageKind.Image, context =>
            {
                var payload = (WeChatWorkWebhookImageChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookImageMessage(payload.Image!),
                    WeChatWorkWebhookMessageKind.Image);
            })
            .Map(WeChatWorkWebhookMessageKind.News, context =>
            {
                var payload = (WeChatWorkWebhookNewsChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookNewsMessage(payload.News!),
                    WeChatWorkWebhookMessageKind.News);
            })
            .Map(WeChatWorkWebhookMessageKind.File, context =>
            {
                var payload = (WeChatWorkWebhookFileChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookFileMessage(payload.File!),
                    WeChatWorkWebhookMessageKind.File);
            })
            .Map(WeChatWorkWebhookMessageKind.Voice, context =>
            {
                var payload = (WeChatWorkWebhookVoiceChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookVoiceMessage(payload.Voice!),
                    WeChatWorkWebhookMessageKind.Voice);
            })
            .Map(WeChatWorkWebhookMessageKind.TemplateCard, context =>
            {
                var payload = (WeChatWorkWebhookTemplateCardChannelData)context.ChannelData;

                return WeChatWorkWebhookMessageFactoryResult.Create(
                    new WeChatWorkWebhookTemplateCardMessage(payload.TemplateCard!),
                    WeChatWorkWebhookMessageKind.TemplateCard);
            });
    }
}
