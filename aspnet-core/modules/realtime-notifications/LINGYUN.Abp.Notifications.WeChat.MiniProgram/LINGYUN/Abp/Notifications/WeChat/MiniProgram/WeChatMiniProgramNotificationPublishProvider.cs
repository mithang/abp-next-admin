using LINGYUN.Abp.WeChat.Common.Security.Claims;
using LINGYUN.Abp.WeChat.MiniProgram.Features;
using LINGYUN.Abp.WeChat.MiniProgram.Messages;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Features;

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

/// <summary>
/// Nhà cung cấp đẩy thông báo của Mini Program WeChat
/// </summary>
/// <remarks>
/// Dữ liệu mẫu của thông báo đăng ký Mini Program vốn là các cặp khóa-giá trị động, vì vậy tải trọng chỉ khai báo các trường vô hướng,
/// Dữ liệu mẫu vẫn lấy trực tiếp từ gói thuộc tính của dữ liệu thông báo.
/// </remarks>
public class WeChatMiniProgramNotificationPublishProvider : NotificationPublishProvider
{
    public const string ProviderName = NotificationProviderNames.WechatMiniProgram;
    public override string Name => ProviderName;
    protected IFeatureChecker FeatureChecker => ServiceProvider.LazyGetRequiredService<IFeatureChecker>();
    protected ISubscribeMessager SubscribeMessager => ServiceProvider.LazyGetRequiredService<ISubscribeMessager>();
    protected IOptions<AbpNotificationsWeChatMiniProgramOptions> Options => ServiceProvider.LazyGetRequiredService<IOptions<AbpNotificationsWeChatMiniProgramOptions>>();
    protected INotificationChannelDataResolver ChannelDataResolver => ServiceProvider.LazyGetRequiredService<INotificationChannelDataResolver>();

    protected async override Task<bool> CanPublishAsync(NotificationInfo notification, CancellationToken cancellationToken = default)
    {
        if (!await FeatureChecker.IsEnabledAsync(true,
            WeChatMiniProgramFeatures.Enable,
            WeChatMiniProgramFeatures.Messages.Enable))
        {
            Logger.LogWarning(
                "{0} cannot push messages because the feature {1} is not enabled",
                Name,
                WeChatMiniProgramFeatures.Messages.Enable);
            return false;
        }
        return true;
    }

    protected async override Task PublishAsync(NotificationPublishContext context, CancellationToken cancellationToken = default)
    {
        // WeChat không hỗ trợ đẩy tới tất cả người dùng
        // Trong Mini Program, sau khi người dùng đăng ký nhận thông báo thì đăng ký thông báo mẫu tương ứng qua giao diện api/subscribes/subscribe
        var channelData = ResolveChannelData(context.Notification.Data);

        foreach (var identifier in context.Users)
        {
            if (channelData.TemplateId.IsNullOrWhiteSpace())
            {
                context.Cancel("Wechat weapp template id be empty, can not send notification!");
                Logger.LogWarning(context.Reason);
                continue;
            }

            Logger.LogDebug($"Get wechat weapp template id: {channelData.TemplateId}");

            Logger.LogDebug($"Get wechat weapp redirect page: {channelData.RedirectPage ?? "null"}");
            Logger.LogDebug($"Get wechat weapp state: {channelData.WeAppState ?? null}");
            Logger.LogDebug($"Get wechat weapp language: {channelData.WeAppLanguage ?? null}");

            // TODO: Nếu phía WeChat phát hành thông báo, hãy lắp ráp sẵn trường openid trong nội dung dữ liệu thông báo
            var openId = ChannelDataResolver.GetOrNull(context.Notification.Data, AbpWeChatClaimTypes.OpenId);

            if (openId.IsNullOrWhiteSpace())
            {
                // Gửi thông báo đăng ký của Mini Program
                await SubscribeMessager
                    .SendAsync(
                        identifier.UserId,
                        channelData.TemplateId!,
                        channelData.RedirectPage,
                        channelData.WeAppLanguage,
                        channelData.WeAppState,
                        context.Notification.Data.ExtraProperties,
                        cancellationToken);
            }
            else
            {
                var weChatWeAppNotificationData = new SubscribeMessage(
                    openId,
                    channelData.TemplateId!,
                    channelData.RedirectPage,
                    channelData.WeAppState,
                    channelData.WeAppLanguage);

                // Ghi dữ liệu mẫu
                weChatWeAppNotificationData.WriteData(context.Notification.Data.ExtraProperties);

                Logger.LogDebug($"Sending wechat weapp notification: {context.Notification.Name}");

                // Gửi thông báo đăng ký của Mini Program
                await SubscribeMessager.SendAsync(weChatWeAppNotificationData, cancellationToken);

                Logger.LogDebug("The notification: {0} with provider: {1} has successfully published!", context.Notification.Name, Name);
            }
        }
    }

    /// <summary>
    /// Phân giải dữ liệu kênh Mini Program
    /// </summary>
    /// <remarks>
    /// Tên khóa mang tiền tố của kênh này, việc đọc không phân biệt chữ hoa/thường;
    /// Để các nhà sản xuất đã cài đặt nâng cấp trơn tru, ở đây thực hiện đọc dự phòng chỉ-đọc đối với các **khóa không có tiền tố** còn tồn tại từ trước;
    /// Giá trị mặc định lấy từ cấu hình kênh.
    /// </remarks>
    protected virtual WeChatMiniProgramSubscribeChannelData ResolveChannelData(NotificationData notificationData)
    {
        var channelData = ChannelDataResolver.Resolve<WeChatMiniProgramSubscribeChannelData>(notificationData)
            ?? new WeChatMiniProgramSubscribeChannelData();

        // Đọc dự phòng chỉ-đọc đối với khóa không có tiền tố còn tồn tại từ trước
        ApplyLegacyKeys(channelData, notificationData);

        if (channelData.TemplateId.IsNullOrWhiteSpace())
        {
            channelData.TemplateId = Options.Value.DefaultTemplateId;
        }
        if (channelData.WeAppState.IsNullOrWhiteSpace())
        {
            channelData.WeAppState = Options.Value.DefaultState;
        }
        if (channelData.WeAppLanguage.IsNullOrWhiteSpace())
        {
            channelData.WeAppLanguage = Options.Value.DefaultLanguage;
        }

        return channelData;
    }

    /// <summary>
    /// Đọc dự phòng khóa không có tiền tố còn tồn tại từ trước
    /// </summary>
    /// <remarks>
    /// <para>
    /// Phiên bản trước đây dùng các khóa không có tiền tố như <c>TemplateId</c>, các nhà sản xuất đã cài đặt có thể vẫn đang ghi.
    /// Khóa có tiền tố được ưu tiên; khi trúng khóa cũ sẽ ghi một cảnh báo để thúc đẩy việc di chuyển.
    /// </para>
    /// </remarks>
#pragma warning disable CS0618 // Type or member is obsolete: the only sanctioned read site for legacy keys
    protected virtual void ApplyLegacyKeys(
        WeChatMiniProgramSubscribeChannelData channelData,
        NotificationData notificationData)
    {
        if (channelData.TemplateId.IsNullOrWhiteSpace())
        {
            channelData.TemplateId = ReadLegacy(notificationData, WeChatMiniProgramNotificationDataKeys.Legacy.TemplateId);
        }
        if (channelData.RedirectPage.IsNullOrWhiteSpace())
        {
            channelData.RedirectPage = ReadLegacy(notificationData, WeChatMiniProgramNotificationDataKeys.Legacy.RedirectPage);
        }
        if (channelData.WeAppState.IsNullOrWhiteSpace())
        {
            channelData.WeAppState = ReadLegacy(notificationData, WeChatMiniProgramNotificationDataKeys.Legacy.WeAppState);
        }
        if (channelData.WeAppLanguage.IsNullOrWhiteSpace())
        {
            channelData.WeAppLanguage = ReadLegacy(notificationData, WeChatMiniProgramNotificationDataKeys.Legacy.WeAppLanguage);
        }
    }
#pragma warning restore CS0618

    private string? ReadLegacy(NotificationData notificationData, string legacyKey)
    {
        var value = ChannelDataResolver.GetOrNull(notificationData, legacyKey);
        if (!value.IsNullOrWhiteSpace())
        {
            Logger.LogWarning(
                "The wechat mini program notification data is using the legacy key '{LegacyKey}' without channel prefix. " +
                "Please migrate to the prefixed key '{Prefix}...'.",
                legacyKey,
                WeChatMiniProgramNotificationDataKeys.Prefix);
        }

        return value;
    }
}
