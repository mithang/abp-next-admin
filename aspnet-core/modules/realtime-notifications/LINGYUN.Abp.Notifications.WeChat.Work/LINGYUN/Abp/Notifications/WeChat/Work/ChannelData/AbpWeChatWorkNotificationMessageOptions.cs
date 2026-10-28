using LINGYUN.Abp.WeChat.Work.Messages;
using System;
using System.Collections.Generic;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Tùy chọn xây dựng tin nhắn WeChat Work
/// </summary>
/// <remarks>
/// <para>
/// Việc đăng ký tập trung tại đây cho phép chuyển đổi từ dạng dữ liệu kênh sang đối tượng mang tin nhắn, khi thêm một loại tin nhắn mới chỉ cần
/// <c>options.Map(kind, factory)</c>, không cần sửa logic phát hành của Provider.
/// </para>
/// <para>
/// So với chuỗi dò tìm <c>if/else</c> cũ, việc điều phối ở đây là O(1) và tường minh:
/// khi loại tải trọng không khớp với khóa factory, ngoại lệ sẽ được ném ra ngay, thay vì lặng lẽ gửi đi tin nhắn sai.
/// </para>
/// </remarks>
public class AbpWeChatWorkNotificationMessageOptions
{
    private readonly Dictionary<WeChatWorkMessageKind, Func<WeChatWorkMessageFactoryContext, WeChatWorkMessageFactoryResult>> _factories
        = new Dictionary<WeChatWorkMessageKind, Func<WeChatWorkMessageFactoryContext, WeChatWorkMessageFactoryResult>>();

    /// <summary>
    /// Các loại tin nhắn đã đăng ký
    /// </summary>
    public IReadOnlyCollection<WeChatWorkMessageKind> MessageKinds => _factories.Keys;

    /// <summary>
    /// Đăng ký factory xây dựng tin nhắn
    /// </summary>
    public AbpWeChatWorkNotificationMessageOptions Map(
        WeChatWorkMessageKind kind,
        Func<WeChatWorkMessageFactoryContext, WeChatWorkMessageFactoryResult> factory)
    {
        Check.NotNull(factory, nameof(factory));

        _factories[kind] = factory;

        return this;
    }

    /// <summary>
    /// Xây dựng đối tượng mang tin nhắn
    /// </summary>
    public WeChatWorkMessageFactoryResult Create(WeChatWorkMessageFactoryContext context)
    {
        Check.NotNull(context, nameof(context));

        var kind = context.ChannelData.Kind;

        if (!_factories.TryGetValue(kind, out var factory))
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The WeChat Work message kind '{kind}' has not been mapped, please call '{nameof(Map)}' when configuring '{nameof(AbpWeChatWorkNotificationMessageOptions)}'.");
        }

        var result = factory(context);
        if (result == null || result.Message == null)
        {
            throw new AbpNotificationChannelDataConfigurationException(
                $"The factory of the WeChat Work message kind '{kind}' returned an empty message.");
        }

        return result;
    }

    /// <summary>
    /// Lấy factory đã đăng ký
    /// </summary>
    public bool TryGetFactory(
        WeChatWorkMessageKind kind,
        out Func<WeChatWorkMessageFactoryContext, WeChatWorkMessageFactoryResult>? factory)
    {
        return _factories.TryGetValue(kind, out factory);
    }
}
