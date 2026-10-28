using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Tập hợp các kiểu dữ liệu kênh thông báo (tải trọng)
/// </summary>
/// <remarks>
/// Các tải trọng trong cùng một kênh được sắp xếp theo <see cref="NotificationChannelDataAttribute.Priority"/>,
/// Thứ tự khớp phải được khai báo tường minh, không được phụ thuộc vào thứ tự đăng ký hay thứ tự dò tìm trường.
/// </remarks>
public sealed class NotificationChannelDataDescriptorList : List<NotificationChannelDataDescriptor>
{
}
