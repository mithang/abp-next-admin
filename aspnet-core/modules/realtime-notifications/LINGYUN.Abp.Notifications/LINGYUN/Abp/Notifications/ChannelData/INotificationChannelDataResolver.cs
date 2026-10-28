using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ phân tích dữ liệu kênh thông báo (tải trọng)
/// </summary>
public interface INotificationChannelDataResolver
{
    /// <summary>
    /// Phân tích tải trọng của kênh đã chỉ định theo thứ tự khớp
    /// </summary>
    /// <remarks>
    /// Chỉ trả về tải trọng "đã ghi và có thể phân tích"; khi truyền vào dữ liệu không hợp lệ sẽ bị bỏ qua và ghi nhật ký,
    /// Nếu kênh cần phân biệt trường hợp này, nên dùng phối hợp với <see cref="IsDeclared"/>.
    /// </remarks>
    IReadOnlyList<NotificationChannelData> Resolve(string providerName, NotificationData notificationData);

    /// <summary>
    /// Phân tích dữ liệu kênh của kiểu đã chỉ định
    /// </summary>
    /// <returns>Phiên bản tải trọng, trả về null khi chưa ghi hoặc không thể phân tích</returns>
    TChannelData? Resolve<TChannelData>(NotificationData notificationData)
        where TChannelData : NotificationChannelData;

    /// <summary>
    /// Phân tích dữ liệu kênh của kiểu đã chỉ định
    /// </summary>
    NotificationChannelData? Resolve(Type payloadType, NotificationData notificationData);

    /// <summary>
    /// Xác định nhà sản xuất có khai báo dữ liệu kênh của kiểu đã chỉ định hay không
    /// </summary>
    /// <remarks>
    /// Dùng phối hợp với kết quả phân tích, có thể phân biệt
    /// "Nhà sản xuất chưa ghi tải trọng" với "Tải trọng đã ghi nhưng không thể phân tích (dữ liệu không hợp lệ)".
    /// Trường hợp sau thuộc lỗi của nhà sản xuất, kênh nên báo lỗi rõ ràng thay vì âm thầm quay lại.
    /// </remarks>
    bool IsDeclared(NotificationData notificationData, Type payloadType);

    /// <summary>
    /// Lấy tập hợp kiểu tải trọng của kênh đã chỉ định
    /// </summary>
    IReadOnlyList<Type> GetPayloadTypes(string providerName);

    /// <summary>
    /// Lấy khóa định danh của tải trọng
    /// </summary>
    /// <remarks>
    /// Trả về khóa thuộc tính "tham gia xác định sự tồn tại" đầu tiên của tải trọng (tên khóa thực tế trong dữ liệu),
    /// Dùng cho thông tin chẩn đoán (ví dụ "khóa nào phân tích thất bại"). Trả về null khi chưa khai báo thuộc tính có thể khớp.
    /// </remarks>
    string? GetKey(NotificationData notificationData, Type payloadType);

    /// <summary>
    /// Đọc kiểu yếu, và chuyển đổi sang kiểu đích
    /// </summary>
    object? Get(NotificationData notificationData, string key, Type targetType);

    /// <summary>
    /// Đọc theo kiểu khóa dữ liệu kênh
    /// </summary>
    /// <remarks>
    /// Dùng để đọc "tùy chọn vô hướng rải rác" (như safe, enable_id_trans của WeChat Doanh nghiệp),
    /// Các giá trị này không cần kiểu tải trọng độc lập, nhưng cũng phải trải qua chuyển đổi kiểu yếu.
    /// </remarks>
    TValue? GetValue<TValue>(NotificationData notificationData, string key)
        where TValue : struct;

    /// <summary>
    /// Đọc theo kiểu khóa dữ liệu kênh, trả về giá trị mặc định khi chưa đặt
    /// </summary>
    TValue GetValue<TValue>(NotificationData notificationData, string key, TValue defaultValue)
        where TValue : struct;

    /// <summary>
    /// Đọc khóa dữ liệu kênh không phân biệt chữ hoa chữ thường
    /// </summary>
    /// <remarks>
    /// Dùng để tương thích khóa cũ phân biệt chữ hoa chữ thường trong triển khai kênh lịch sử (như <c>TemplateId</c>),
    /// Tránh nhà sản xuất âm thầm mất hiệu lực do khác biệt chữ hoa chữ thường.
    /// </remarks>
    string? GetOrNull(NotificationData notificationData, params string[] keys);
}
