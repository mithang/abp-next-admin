using LINGYUN.Abp.WeChat.Work.Authorize;
using LINGYUN.Abp.WeChat.Work.Features;
using LINGYUN.Abp.WeChat.Work.Messages;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using LINGYUN.Abp.WeChat.Work.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Features;
using Volo.Abp.Settings;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Kênh phát hành thông báo WeChat Work
/// </summary>
public class WeChatWorkNotificationPublishProvider : NotificationPublishProvider
{
    public const string ProviderName = NotificationProviderNames.WechatWork;

    public override string Name => ProviderName;

    protected IFeatureChecker FeatureChecker => ServiceProvider.LazyGetRequiredService<IFeatureChecker>();
    protected ISettingProvider SettingProvider => ServiceProvider.LazyGetRequiredService<ISettingProvider>();
    protected IWeChatWorkMessageSender WeChatWorkMessageSender => ServiceProvider.LazyGetRequiredService<IWeChatWorkMessageSender>();
    protected INotificationDataSerializer NotificationDataSerializer => ServiceProvider.LazyGetRequiredService<INotificationDataSerializer>();
    protected IWeChatWorkUserClaimProvider WeChatWorkInternalUserFinder => ServiceProvider.LazyGetRequiredService<IWeChatWorkUserClaimProvider>();
    protected INotificationDefinitionManager NotificationDefinitionManager => ServiceProvider.LazyGetRequiredService<INotificationDefinitionManager>();
    protected INotificationChannelDataResolver ChannelDataResolver => ServiceProvider.LazyGetRequiredService<INotificationChannelDataResolver>();
    protected IOptions<AbpWeChatWorkNotificationMessageOptions> MessageOptions => ServiceProvider.LazyGetRequiredService<IOptions<AbpWeChatWorkNotificationMessageOptions>>();

    protected async override Task<bool> CanPublishAsync(NotificationInfo notification, CancellationToken cancellationToken = default)
    {
        if (!await FeatureChecker.IsEnabledAsync(true,
            WeChatWorkFeatureNames.Enable,
            WeChatWorkFeatureNames.Message.Enable))
        {
            Logger.LogWarning(
                "{0} cannot push messages because the feature {1} is not enabled",
                Name,
                WeChatWorkFeatureNames.Message.Enable);
            return false;
        }
        return true;
    }

    protected async override Task PublishAsync(
        NotificationPublishContext context,
        CancellationToken cancellationToken = default)
    {
        var agentId = await SettingProvider.GetOrNullAsync(WeChatWorkSettingNames.Connection.AgentId);
        if (agentId.IsNullOrWhiteSpace())
        {
            context.Cancel("Unable to send work weixin messages because agentId is not set.");
            Logger.LogWarning(context.Reason);
            return;
        }

        var notificationData = await NotificationDataSerializer.ToStandard(context.Notification.Data);
        if (notificationData.Title.IsNullOrWhiteSpace() && notificationData.Message.IsNullOrWhiteSpace())
        {
            context.Cancel("Unable to send work weixin messages because the title and content of the message must not be empty.");
            Logger.LogWarning(context.Reason);
            return;
        }

        var notificationDefine = await NotificationDefinitionManager.GetOrNullAsync(context.Notification.Name);

        var contact = await ResolveContactAsync(context, notificationDefine, cancellationToken);
        if (contact.IsEmpty())
        {
            // touser, toparty, totag không được đồng thời để trống: https://developer.work.weixin.qq.com/document/path/90236
            context.Cancel("Unable to send work weixin messages because The recipient/department/label cannot be empty simultaneously.");
            Logger.LogWarning(context.Reason);
            return;
        }

        var options = WeChatWorkMessageOptions.From(ChannelDataResolver, context.Notification.Data);
        options.AgentId = agentId;

        var messages = ResolveMessages(context, notificationData, contact, options);
        if (messages.Count == 0)
        {
            context.Cancel("Unable to send work weixin messages because WeChatWorkMessage is null.");
            Logger.LogWarning(context.Reason);
            return;
        }
        var failures = new List<Exception>();

        foreach (var message in messages)
        {
            try
            {
                var response = await WeChatWorkMessageSender.SendAsync(message.Message, cancellationToken);

                if (!response.IsSuccessed)
                {
                    // WeChat Work trả về thất bại bằng mã lỗi nghiệp vụ, tầng trên bắt buộc phải nhận biết, nếu không thất bại sẽ bị ghi nhận thành thành công
                    context.Cancel(
                        $"Unable to send work weixin messages, error code: {response.ErrorCode}, error message: {response.ErrorMessage}");

                    Logger.LogWarning(
                        "The notification: {Notification} with provider: {Provider} and message kind: {Kind} failed, error code: {ErrorCode}, error message: {ErrorMessage}",
                        context.Notification.Name, Name, message.Kind, response.ErrorCode, response.ErrorMessage);
                    continue;
                }

                Logger.LogDebug(
                    "The notification: {Notification} with provider: {Provider} and message kind: {Kind} has successfully published!",
                    context.Notification.Name, Name, message.Kind);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex,
                    "Send notification {Notification} with provider {Provider} and message kind {Kind} failed",
                    context.Notification.Name, Name, message.Kind);
                failures.Add(ex);
            }
        }

        if (failures.Count > 0)
        {
            context.Cancel(
                $"Failed to send work weixin messages of notification '{context.Notification.Name}'.",
                new AggregateException(
                    $"Failed to send work weixin messages of notification '{context.Notification.Name}'.",
                    failures));
        }
    }

    /// <summary>
    /// Phân tích người nhận tin nhắn
    /// </summary>
    /// <remarks>
    /// Định danh thành viên được phân tích từ quan hệ liên kết danh tính WeChat Work, phòng ban và nhãn ưu tiên lấy từ dữ liệu thông báo, sau đó lấy từ định nghĩa thông báo.
    /// </remarks>
    protected async virtual Task<WeChatWorkNotificationContact> ResolveContactAsync(
        NotificationPublishContext context,
        NotificationDefinition? notificationDefine,
        CancellationToken cancellationToken = default)
    {
        var toUser = await WeChatWorkInternalUserFinder.FindUserIdentifierListAsync(
            context.Users.Select(id => id.UserId),
            cancellationToken);

        var toTag = ChannelDataResolver.GetOrNull(context.Notification.Data, WeChatWorkNotificationDataKeys.ToTag)
            ?? notificationDefine?.GetTagOrNull();

        var toParty = ChannelDataResolver.GetOrNull(context.Notification.Data, WeChatWorkNotificationDataKeys.ToParty)
            ?? notificationDefine?.GetPartyOrNull();

        return WeChatWorkNotificationContact.From(
            toUser: toUser.JoinAsString("|"),
            toParty: toParty,
            toTag: toTag);
    }

    /// <summary>
    /// Phân tích tập hợp carrier tin nhắn chờ gửi
    /// </summary>
    /// <remarks>
    /// Ưu tiên sử dụng dữ liệu kênh (payload) mà producer khai báo tường minh;
    /// Khi chưa khai báo thì suy ra carrier mặc định theo loại nội dung thông báo, đảm bảo hành vi của producer hiện có không thay đổi.
    /// </remarks>
    protected virtual List<WeChatWorkMessageFactoryResult> ResolveMessages(
        NotificationPublishContext context,
        NotificationStandardData standardData,
        WeChatWorkNotificationContact contact,
        WeChatWorkMessageOptions options)
    {
        var messages = new List<WeChatWorkMessageFactoryResult>();

        if (TryResolveChannelData(context, out var invalidPayload, out var resolvedPayloads))
        {
            foreach (var channelData in resolvedPayloads)
            {
                messages.Add(CreateMessage(channelData, context.Notification, standardData, contact, options));
            }
        }
        else
        {
            context.Cancel(
                $"Unable to send work weixin messages because the work weixin payload '{invalidPayload}' can not be parsed, please check the notification data written by the producer.");
            Logger.LogWarning(context.Reason);
            return messages;
        }

        if (messages.Count == 0)
        {
            var defaultChannelData = CreateDefaultChannelData(context, standardData);
            if (defaultChannelData != null)
            {
                messages.Add(CreateMessage(defaultChannelData, context.Notification, standardData, contact, options));
            }
        }

        return messages;
    }

    /// <summary>
    /// Phân tích dữ liệu kênh (payload)
    /// </summary>
    /// <remarks>
    /// Phân biệt "producer chưa ghi payload" với "payload đã ghi nhưng không thể phân tích":
    /// Trường hợp sau là lỗi của producer, phải báo lỗi rõ ràng, thay vì lặng lẽ quay về carrier mặc định.
    /// </remarks>
    protected virtual bool TryResolveChannelData(
        NotificationPublishContext context,
        out string? invalidPayloadKey,
        out List<NotificationChannelData> resolvedPayloads)
    {
        invalidPayloadKey = null;
        resolvedPayloads = new List<NotificationChannelData>();

        foreach (var payloadType in ChannelDataResolver.GetPayloadTypes(ProviderName))
        {
            if (!ChannelDataResolver.IsDeclared(context.Notification.Data, payloadType))
            {
                continue;
            }

            var payload = ChannelDataResolver.Resolve(payloadType, context.Notification.Data);

            if (payload == null)
            {
                invalidPayloadKey = ChannelDataResolver.GetKey(context.Notification.Data, payloadType);
                return false;
            }

            resolvedPayloads.Add(payload);
        }

        return true;
    }

    /// <summary>
    /// Suy ra carrier tin nhắn mặc định theo loại nội dung thông báo
    /// </summary>
    protected virtual WeChatWorkChannelData? CreateDefaultChannelData(
        NotificationPublishContext context,
        NotificationStandardData standardData)
    {
        switch (context.Notification.ContentType)
        {
            case NotificationContentType.Text:
                return new WeChatWorkTextChannelData
                {
                    Content = standardData.Message
                };

            case NotificationContentType.Html:
                return new WeChatWorkTextCardChannelData
                {
                    TextCard = new TextCardMessage(
                        standardData.Title ?? string.Empty,
                        // Triển khai cũ đã bỏ qua description, tại đây bổ sung mô tả của thẻ văn bản
                        standardData.Description.IsNullOrWhiteSpace() ? standardData.Message : standardData.Description!,
                        // Địa chỉ chuyển hướng phải do producer chỉ định tường minh qua payload, mặc định không thể nhấn
                        "javascript:;")
                };

            case NotificationContentType.Markdown:
                return new WeChatWorkMarkdownChannelData
                {
                    Content = standardData.Message
                };

            default:
                Logger.LogWarning(
                    "The notification: {Notification} with provider: {Provider} can not resolve a work weixin message for content type: {ContentType}.",
                    context.Notification.Name, Name, context.Notification.ContentType);
                return null;
        }
    }

    protected virtual WeChatWorkMessageFactoryResult CreateMessage(
        NotificationChannelData channelData,
        NotificationInfo notification,
        NotificationStandardData standardData,
        WeChatWorkNotificationContact contact,
        WeChatWorkMessageOptions options)
    {
        if (channelData is not WeChatWorkChannelData weChatWorkChannelData)
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The channel data '{channelData.GetType().FullName}' is not a work weixin channel data.");
        }

        var factoryContext = new WeChatWorkMessageFactoryContext(
            notification,
            standardData,
            weChatWorkChannelData,
            contact,
            options);

        return MessageOptions.Value.Create(factoryContext);
    }
}
