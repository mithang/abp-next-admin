using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.MiniProgram.Messages;

/// <summary>
/// Tin nhắn mẫu của Mini Program
/// Chi tiết: https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html
/// </summary>
/// <remarks>
/// Hiện tại chỉ triển khai gửi tin nhắn đăng ký
/// </remarks>
public interface ISubscribeMessager
{
    /// <summary>
    /// Gửi tin nhắn đăng ký
    /// </summary>
    /// <param name="message"></param>
    /// <param name="cancellation"></param>
    /// <returns></returns>
    Task SendAsync(SubscribeMessage message, CancellationToken cancellation = default);
    /// <summary>
    /// Gửi tin nhắn đăng ký
    /// </summary>
    /// <param name="toUser">Người dùng</param>
    /// <param name="templateId">Mẫu</param>
    /// <param name="page">Trang chuyển hướng</param>
    /// <param name="lang">Ngôn ngữ</param>
    /// <param name="state">Loại</param>
    /// <param name="data">Dữ liệu</param>
    /// <param name="cancellation"></param>
    /// <returns></returns>
    Task SendAsync(
        Guid toUser, 
        string templateId,
        string? page = "",
        string? lang = "zh_CN",
        string? state = "formal",
        Dictionary<string, object?>? data = null,
        CancellationToken cancellation = default);
}
