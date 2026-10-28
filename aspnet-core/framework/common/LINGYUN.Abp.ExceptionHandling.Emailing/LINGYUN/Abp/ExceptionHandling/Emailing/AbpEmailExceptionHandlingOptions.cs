using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.ExceptionHandling.Emailing;

public class AbpEmailExceptionHandlingOptions
{
    /// <summary>
    /// Gửi thông tin stack trace
    /// </summary>
    public bool SendStackTrace { get; set; } = false;
    /// <summary>
    /// Tiêu đề email mặc định
    /// </summary>
    public string? DefaultTitle { get; set; }
    /// <summary>
    /// Phần đầu nội dung email mặc định
    /// </summary>
    public string? DefaultContentHeader { get; set; }
    /// <summary>
    /// Phần cuối nội dung email mặc định
    /// </summary>
    public string? DefaultContentFooter { get; set; }
    /// <summary>
    /// Người nhận email ngoại lệ mặc định
    /// </summary>
    public string? DefaultReceiveEmail { get; set; }
    /// <summary>
    /// Danh sách mapping xử lý người nhận theo loại ngoại lệ
    /// </summary>
    public IDictionary<Type, string> Handlers { get; set; }
    public AbpEmailExceptionHandlingOptions()
    {
        Handlers = new Dictionary<Type, string>();
    }

    /// <summary>
    /// Thêm người dùng cần nhận thông báo ngoại lệ vào danh sách xử lý
    /// </summary>
    /// <typeparam name="TException">Loại ngoại lệ được xử lý</typeparam>
    /// <param name="receivedEmails">Nhóm người dùng nhận email, dùng để gửi hàng loạt, phân tách bằng ký tự</param>
    public void HandReceivedException<TException>(string receivedEmails) where TException : Exception
    {
        HandReceivedException(typeof(TException), receivedEmails);
    }
    /// <summary>
    /// Thêm người dùng cần nhận thông báo ngoại lệ vào danh sách xử lý
    /// </summary>
    /// <param name="ex">Loại ngoại lệ được xử lý</param>
    /// <param name="receivedEmails">Nhóm người dùng nhận email, dùng để gửi hàng loạt, phân tách bằng ký tự</param>
    public void HandReceivedException(Type exceptionType, string receivedEmails)
    {
        if (Handlers.ContainsKey(exceptionType))
        {
            Handlers[exceptionType] += receivedEmails;
        }
        else
        {
            Handlers.Add(exceptionType, receivedEmails);
        }
    }

    public string? GetReceivedEmailOrDefault(Type exceptionType)
    {
        if (Handlers.TryGetValue(exceptionType, out var receivedUsers))
        {
            return receivedUsers;
        }
        return DefaultReceiveEmail;
    }
}
