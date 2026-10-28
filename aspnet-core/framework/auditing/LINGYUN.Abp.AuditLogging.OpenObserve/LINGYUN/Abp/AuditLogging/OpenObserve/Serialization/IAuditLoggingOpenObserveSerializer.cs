namespace LINGYUN.Abp.AuditLogging.OpenObserve.Serialization;

/// <summary>
/// Bộ tuần tự hóa OpenObserve cho nhật ký kiểm toán
/// </summary>
/// <remarks>
/// Dùng cho các thành viên cần lưu dưới dạng cột chuỗi JSON (ví dụ chi tiết thuộc tính thay đổi của thực thể <c>propertychanges</c>),
/// Triển khai mặc định ủy quyền cho <c>IJsonSerializer</c>, nhờ đó tái sử dụng
/// <c>AbpSystemTextJsonSerializerModifiersOptions</c> bộ trang trí đã đăng ký
/// </remarks>
public interface IAuditLoggingOpenObserveSerializer
{
    string Serialize<T>(T value);

    T? Deserialize<T>(string jsonString);
}
