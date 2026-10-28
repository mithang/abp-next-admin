using LINGYUN.Abp.WeChat.Work.Messages;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using System;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Factory xây dựng tin nhắn mặc định của WeChat Work
/// </summary>
/// <remarks>
/// <para>
/// Mỗi ánh xạ giữa dữ liệu kênh (payload) và vật mang tin nhắn đều là tường minh; khi thêm loại tin nhắn mới chỉ cần thêm một lệnh gọi
/// <c>Map</c>, không cần sửa logic phát hành của Provider.
/// </para>
/// <para>
/// Các vật mang tin nhắn của WeChat Work hỗ trợ các tùy chọn không nhất quán, vì vậy được nạp chồng riêng theo từng loại vật mang cụ thể,
/// để trình biên dịch đảm bảo chỉ đặt các trường mà vật mang thực sự hỗ trợ, thay vì gán không phân biệt như cách triển khai cũ.
/// </para>
/// </remarks>
public static class WeChatWorkMessageFactoryExtensions
{
    /// <summary>
    /// Đăng ký factory xây dựng tin nhắn tích hợp sẵn
    /// </summary>
    public static AbpWeChatWorkNotificationMessageOptions MapDefaultMessageFactories(
        this AbpWeChatWorkNotificationMessageOptions options)
    {
        Check.NotNull(options, nameof(options));

        options.Map(WeChatWorkMessageKind.MiniProgramNotice, context =>
        {
            var channelData = Cast<WeChatWorkMiniProgramNoticeChannelData>(context);
            var miniProgram = channelData.MiniProgram
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work mini program notice of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(
                    new WeChatWorkMiniProgramMessage(
                        miniProgram,
                        context.Contact.ToUser ?? string.Empty,
                        context.Contact.ToParty ?? string.Empty,
                        context.Contact.ToTag ?? string.Empty),
                    context),
                WeChatWorkMessageKind.MiniProgramNotice);
        });

        options.Map(WeChatWorkMessageKind.MpNews, context =>
        {
            var channelData = Cast<WeChatWorkMpNewChannelData>(context);
            var mpNewMessage = channelData.MpNewMessage
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work mp news of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkMpNewMessage(context.Options.AgentId, mpNewMessage), context),
                WeChatWorkMessageKind.MpNews);
        });

        options.Map(WeChatWorkMessageKind.TemplateCard, context =>
        {
            var channelData = Cast<WeChatWorkTemplateCardChannelData>(context);
            var templateCard = channelData.TemplateCard
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work template card of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkTemplateCardMessage(context.Options.AgentId, templateCard), context),
                WeChatWorkMessageKind.TemplateCard);
        });

        options.Map(WeChatWorkMessageKind.TextCard, context =>
        {
            var channelData = Cast<WeChatWorkTextCardChannelData>(context);
            var textCard = channelData.TextCard
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work text card of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkTextCardMessage(context.Options.AgentId, textCard), context),
                WeChatWorkMessageKind.TextCard);
        });

        options.Map(WeChatWorkMessageKind.Video, context =>
        {
            var channelData = Cast<WeChatWorkVideoChannelData>(context);
            var video = channelData.Video
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work video of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkVideoMessage(context.Options.AgentId, video), context),
                WeChatWorkMessageKind.Video);
        });

        options.Map(WeChatWorkMessageKind.Voice, context =>
        {
            var channelData = Cast<WeChatWorkVoiceChannelData>(context);
            var voice = channelData.Voice
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work voice of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkVoiceMessage(context.Options.AgentId, voice), context),
                WeChatWorkMessageKind.Voice);
        });

        options.Map(WeChatWorkMessageKind.File, context =>
        {
            var channelData = Cast<WeChatWorkFileChannelData>(context);
            var file = channelData.File
                ?? throw new AbpNotificationChannelDataConfigurationException(
                    $"The WeChat Work file of notification '{context.Notification.Name}' is empty.");

            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkFileMessage(context.Options.AgentId, file), context),
                WeChatWorkMessageKind.File);
        });

        options.Map(WeChatWorkMessageKind.Text, context =>
        {
            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkTextMessage(context.Options.AgentId, new TextMessage(GetContent(context))), context),
                WeChatWorkMessageKind.Text);
        });

        options.Map(WeChatWorkMessageKind.Markdown, context =>
        {
            return WeChatWorkMessageFactoryResult.Create(
                Apply(new WeChatWorkMarkdownMessage(context.Options.AgentId, new MarkdownMessage(GetContent(context))), context),
                WeChatWorkMessageKind.Markdown);
        });

        return options;
    }

    private static TChannelData Cast<TChannelData>(WeChatWorkMessageFactoryContext context)
        where TChannelData : WeChatWorkChannelData
    {
        if (context.ChannelData is not TChannelData channelData)
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The channel data '{context.ChannelData.GetType().FullName}' of notification '{context.Notification.Name}' does not match the registered factory '{typeof(TChannelData).FullName}'.");
        }

        return channelData;
    }

    private static string GetContent(WeChatWorkMessageFactoryContext context)
    {
        if (context.ChannelData is WeChatWorkTextChannelData textChannelData &&
            !textChannelData.Content.IsNullOrWhiteSpace())
        {
            return textChannelData.Content!;
        }

        if (context.ChannelData is WeChatWorkMarkdownChannelData markdownChannelData &&
            !markdownChannelData.Content.IsNullOrWhiteSpace())
        {
            return markdownChannelData.Content!;
        }

        return context.StandardData.Message;
    }

    /// <summary>
    /// Áp dụng người nhận
    /// </summary>
    private static TMessage ApplyContact<TMessage>(TMessage message, WeChatWorkMessageFactoryContext context)
        where TMessage : WeChatWorkMessage
    {
        if (!context.Contact.IsEmpty())
        {
            message.ToUser = context.Contact.ToUser;
            message.ToParty = context.Contact.ToParty;
            message.ToTag = context.Contact.ToTag;
        }

        return message;
    }

    /// <summary>
    /// Tin nhắn văn bản: hỗ trợ safe, enable_id_trans, enable_duplicate_check
    /// </summary>
    private static WeChatWorkTextMessage Apply(
        WeChatWorkTextMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.Safe = context.Options.SafeValue;
        message.EnableIdTrans = context.Options.EnableIdTransValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn hình ảnh và văn bản: hỗ trợ safe, enable_id_trans, enable_duplicate_check
    /// </summary>
    private static WeChatWorkMpNewMessage Apply(
        WeChatWorkMpNewMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.Safe = context.Options.SafeValue;
        message.EnableIdTrans = context.Options.EnableIdTransValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn tệp: hỗ trợ safe, enable_duplicate_check, không hỗ trợ enable_id_trans
    /// </summary>
    private static WeChatWorkFileMessage Apply(
        WeChatWorkFileMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.Safe = context.Options.SafeValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn video: hỗ trợ safe, enable_duplicate_check, không hỗ trợ enable_id_trans
    /// </summary>
    private static WeChatWorkVideoMessage Apply(
        WeChatWorkVideoMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.Safe = context.Options.SafeValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn thoại: không hỗ trợ safe, cũng không hỗ trợ enable_id_trans
    /// </summary>
    private static WeChatWorkVoiceMessage Apply(
        WeChatWorkVoiceMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn markdown: hỗ trợ enable_duplicate_check, không hỗ trợ safe
    /// </summary>
    private static WeChatWorkMarkdownMessage Apply(
        WeChatWorkMarkdownMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn thẻ văn bản: không hỗ trợ safe
    /// </summary>
    private static WeChatWorkTextCardMessage Apply(
        WeChatWorkTextCardMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.EnableIdTrans = context.Options.EnableIdTransValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn thẻ mẫu: không hỗ trợ safe
    /// </summary>
    private static WeChatWorkTemplateCardMessage Apply(
        WeChatWorkTemplateCardMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.EnableIdTrans = context.Options.EnableIdTransValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }

    /// <summary>
    /// Tin nhắn thông báo mini program: không hỗ trợ safe
    /// </summary>
    private static WeChatWorkMiniProgramMessage Apply(
        WeChatWorkMiniProgramMessage message,
        WeChatWorkMessageFactoryContext context)
    {
        ApplyContact(message, context);

        message.EnableIdTrans = context.Options.EnableIdTransValue;
        message.EnableDuplicateCheck = context.Options.EnableDuplicateCheckValue;
        message.DuplicateCheckInterval = context.Options.DuplicateCheckIntervalValue;

        return message;
    }
}
