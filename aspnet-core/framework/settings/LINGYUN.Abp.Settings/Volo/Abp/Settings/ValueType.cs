namespace Volo.Abp.Settings;

public enum ValueType
{
    /// <summary>
    /// Không đưa vào quản lý cài đặt (phối hợp với frontend, vui lòng không truyền giá trị cài đặt)
    /// </summary>
    NoSet = -1,
    /// <summary>
    /// Ký tự
    /// </summary>
    String = 0,
    /// <summary>
    /// Số
    /// </summary>
    Number = 1,
    /// <summary>
    /// Boolean
    /// </summary>
    Boolean = 2,
    /// <summary>
    /// Ngày
    /// </summary>
    Date = 3,
    /// <summary>
    /// Mảng
    /// </summary>
    Array = 4,
    /// <summary>
    /// Tùy chọn
    /// </summary>
    Option = 5,
    /// <summary>
    /// Đối tượng
    /// </summary>
    Object = 10
}
