namespace LINGYUN.Abp.OpenObserve.Serialization;

/// <summary>
/// Bộ tuần tự hóa OpenObserve
/// </summary>
/// <remarks>
/// Chịu trách nhiệm thống nhất việc tuần tự hóa thân yêu cầu và giải tuần tự hóa phản hồi, client không phụ thuộc trực tiếp vào cách triển khai tuần tự hóa cụ thể.
/// Cách triển khai mặc định xem <see cref="DefaultOpenObserveSerializer"/>,
/// Khi cần tùy chỉnh (ví dụ thay bằng Newtonsoft hoặc chiến lược khác) thì triển khai giao diện này, và tham khảo cách đăng ký của <see cref="DefaultOpenObserveSerializer"/> để ghi đè cách triển khai mặc định.
/// </remarks>
public interface IOpenObserveSerializer
{
    /// <summary>
    /// Tuần tự hóa thân yêu cầu
    /// </summary>
    string Serialize<T>(T value);

    /// <summary>
    /// Giải tuần tự hóa phản hồi
    /// </summary>
    /// <param name="jsonString">Nội dung phản hồi</param>
    T? Deserialize<T>(string jsonString);

    /// <summary>
    /// Thử giải tuần tự hóa phản hồi
    /// </summary>
    /// <remarks>
    /// Dùng cho các trường hợp cho phép phân tích thất bại như phản hồi lỗi, khi phân tích thất bại sẽ trả về false thay vì ném ngoại lệ
    /// </remarks>
    /// <param name="jsonString">Nội dung phản hồi</param>
    /// <param name="value">Kết quả giải tuần tự hóa</param>
    /// <returns>Trả về true khi phân tích thành công</returns>
    bool TryDeserialize<T>(string jsonString, out T? value);
}
