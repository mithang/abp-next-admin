using System;

namespace LINGYUN.Abp.Idempotent;

[AttributeUsage(AttributeTargets.Method)]
public class IdempotentAttribute : Attribute
{
    /// <summary>
    /// Thời gian chờ hết hạn
    /// </summary>
    public int? Timeout { get; }
    /// <summary>
    /// Danh sách tên tham số dùng để tạo định danh duy nhất
    /// </summary>
    /// <remarks>
    /// Xác định giá trị md5 duy nhất đã tuần tự hóa bằng cách tra cứu giá trị trong danh sách tham số
    /// </remarks>
    public string[]? KeyMap { get; }
    /// <summary>
    /// Mẫu đường dẫn chuyển hướng tài nguyên
    /// </summary>
    /// <remarks>
    /// Định nghĩa một đường dẫn tài nguyên có thể định dạng; khi yêu cầu xung đột, nếu tên tham số trùng khớp thành công thì chuyển hướng đến đường dẫn đích
    /// <br />
    /// Ví dụ: /api/app/demo/{id}
    /// <br />
    /// Ví dụ: /api/app/demo/method?id={id}
    /// </remarks>
    public string? RedirectUrl { get; }
    /// <summary>
    /// Khóa lũy đẳng tùy chỉnh
    /// </summary>
    public string? IdempotentKey { get; set; }
    public IdempotentAttribute()
    {

    }

    public IdempotentAttribute(
        string? iodempotentKey = null,
        int? timeout = null, 
        string? redirectUrl = null,
        string[]? keyMap = null)
    {
        IdempotentKey = iodempotentKey;
        Timeout = timeout;
        KeyMap = keyMap;
        RedirectUrl = redirectUrl;
    }
}
