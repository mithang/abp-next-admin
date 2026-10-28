using System;

namespace LINGYUN.Abp.Wrapper;

/// <summary>
/// Cấu trúc đóng gói giá trị trả về
/// </summary>
/// <typeparam name="TResult"></typeparam>
[Serializable]
public class WrapResult<TResult>
{
    /// <summary>
    /// Mã lỗi
    /// </summary>
    public string Code { get; set; } = default!;
    /// <summary>
    /// Thông báo lỗi
    /// </summary>
    public string Message { get; set; } = default!;
    /// <summary>
    /// Thông báo bổ sung
    /// </summary>
    public string? Details { get; set; }
    /// <summary>
    /// Giá trị trả về
    /// </summary>
    public TResult? Result { get; set; }
    public WrapResult() { }
    public WrapResult(
        string code,
        string message,
        string? details = null)
    {
        Code = code;
        Message = message;
        Details = details;
    }

    public WrapResult(
        string code,
        TResult result,
        string message = "OK")
    {
        Code = code;
        Result = result;
        Message = message;
    }
}
