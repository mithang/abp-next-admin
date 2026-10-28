using LINGYUN.Abp.WeChat.MiniProgram.Messages;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

// Dự án kiểm thử này chưa bật toàn cục ngữ cảnh nullable, nhưng file này cần thể hiện ngữ nghĩa "tham số nullable"
#nullable enable

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

/// <summary>
/// Triển khai giả <see cref="ISubscribeMessager"/> dạng ghi nhận
/// </summary>
/// <remarks>
/// Dùng để assert nội dung thông báo mẫu mà kênh cuối cùng gửi đi, mà không thực sự gọi API WeChat.
/// </remarks>
public class FakeSubscribeMessager : ISubscribeMessager
{
    /// <summary>
    /// Các thông báo mẫu đã gửi (theo thứ tự)
    /// </summary>
    public List<SubscribeMessage> SentMessages { get; } = new();

    /// <summary>
    /// Các lệnh gọi đã gửi ở dạng "theo tham số mẫu"
    /// </summary>
    public List<SentTemplateArgs> SentTemplates { get; } = new();

    public Task SendAsync(SubscribeMessage message, CancellationToken cancellation = default)
    {
        SentMessages.Add(message);
        return Task.CompletedTask;
    }

    public Task SendAsync(
        Guid toUser,
        string templateId,
        string? page = "",
        string? lang = "zh_CN",
        string? state = "formal",
        Dictionary<string, object?>? data = null,
        CancellationToken cancellation = default)
    {
        SentTemplates.Add(new SentTemplateArgs(toUser, templateId, page, lang, state, data));
        return Task.CompletedTask;
    }

    public void Clear()
    {
        SentMessages.Clear();
        SentTemplates.Clear();
    }

    public record SentTemplateArgs(
        Guid ToUser,
        string TemplateId,
        string? Page,
        string? Lang,
        string? State,
        Dictionary<string, object?>? Data);
}
