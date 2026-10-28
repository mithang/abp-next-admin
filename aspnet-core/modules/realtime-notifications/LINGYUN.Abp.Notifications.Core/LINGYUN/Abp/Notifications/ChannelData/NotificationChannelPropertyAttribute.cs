using System;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Đánh dấu thuộc tính của dữ liệu kênh thông báo (payload) tham gia đọc/ghi có kiểu
/// </summary>
/// <remarks>
/// <para>
/// Tên thuộc tính tham gia đọc/ghi mặc định lấy theo tên thuộc tính, cũng có thể chỉ định tường minh qua <see cref="Name"/>,
/// để tương thích với các khóa dữ liệu thông báo cũ (ví dụ các khóa chưa có tiền tố như <c>TemplateId</c>).
/// </para>
/// <para>
/// Quá trình đọc/ghi sẽ thực hiện chuyển đổi kiểu yếu, vì vậy dù dữ liệu trải qua bao nhiêu lần
/// tuần tự hóa/giải tuần tự hóa JSON (lưu trữ bền vững, thử lại khi thất bại, phân phối liên tiến trình) cũng không bị mất.
/// </para>
/// </remarks>
[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
public sealed class NotificationChannelPropertyAttribute : Attribute
{
    /// <summary>
    /// Tên khóa trong dữ liệu thông báo, khi trống sẽ lấy tên thuộc tính
    /// </summary>
    public string? Name { get; }

    /// <summary>
    /// Khi khớp payload có bỏ qua thuộc tính này hay không
    /// </summary>
    /// <remarks>
    /// Áp dụng cho các thuộc tính dạng "tùy chọn phân phối" không quyết định hình thái payload,
    /// ví dụ người nhận của WeChat Work (to_user/toparty/totag).
    /// Khi tùy chọn phân phối tồn tại độc lập thì không có nghĩa là một payload tin nhắn nào đó tồn tại.
    /// </remarks>
    public bool IgnoreWhenMatching { get; set; }

    public NotificationChannelPropertyAttribute()
    {
    }

    public NotificationChannelPropertyAttribute(string name)
    {
        Name = name;
    }
}
