using LINGYUN.Abp.WeChat.Work.Messages;
using System;
using System.Collections.Generic;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Tùy chọn xây dựng thông điệp Webhook WeChat Work
/// </summary>
/// <remarks>
/// <para>
/// Việc chuyển đổi từ hình thái dữ liệu kênh sang vật mang thông điệp được đăng ký tập trung tại đây, để thêm một loại thông điệp mới chỉ cần
/// <c>options.Map(kind, factory)</c>, không cần sửa logic phát hành của contributor.
/// </para>
/// </remarks>
public class AbpNotificationsWebhookWeChatWorkMessageOptions
{
    private readonly Dictionary<WeChatWorkWebhookMessageKind, Func<WeChatWorkWebhookMessageFactoryContext, WeChatWorkWebhookMessageFactoryResult>> _factories
        = new Dictionary<WeChatWorkWebhookMessageKind, Func<WeChatWorkWebhookMessageFactoryContext, WeChatWorkWebhookMessageFactoryResult>>();

    /// <summary>
    /// Các loại thông điệp đã đăng ký
    /// </summary>
    public IReadOnlyCollection<WeChatWorkWebhookMessageKind> MessageKinds => _factories.Keys;

    /// <summary>
    /// Đăng ký factory xây dựng thông điệp
    /// </summary>
    public AbpNotificationsWebhookWeChatWorkMessageOptions Map(
        WeChatWorkWebhookMessageKind kind,
        Func<WeChatWorkWebhookMessageFactoryContext, WeChatWorkWebhookMessageFactoryResult> factory)
    {
        Check.NotNull(factory, nameof(factory));

        _factories[kind] = factory;

        return this;
    }

    /// <summary>
    /// Xây dựng vật mang thông điệp
    /// </summary>
    public WeChatWorkWebhookMessageFactoryResult Create(WeChatWorkWebhookMessageFactoryContext context)
    {
        Check.NotNull(context, nameof(context));

        var kind = context.ChannelData.Kind;

        if (!_factories.TryGetValue(kind, out var factory))
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The WeChat Work webhook message kind '{kind}' has not been mapped, please call '{nameof(Map)}' when configuring '{nameof(AbpNotificationsWebhookWeChatWorkMessageOptions)}'.");
        }

        var result = factory(context);
        if (result == null || result.Message == null)
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The factory of the WeChat Work webhook message kind '{kind}' returned an empty message.");
        }

        return result;
    }

    /// <summary>
    /// Lấy factory đã đăng ký
    /// </summary>
    public bool TryGetFactory(
        WeChatWorkWebhookMessageKind kind,
        out Func<WeChatWorkWebhookMessageFactoryContext, WeChatWorkWebhookMessageFactoryResult>? factory)
    {
        return _factories.TryGetValue(kind, out factory);
    }
}
