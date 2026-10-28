using System;

namespace LINGYUN.Abp.OpenObserve.Models;

/// <summary>
/// Lớp cơ sở của ngoại lệ nghiệp vụ OpenObserve
/// </summary>
public class OpenObserveException : Exception
{
    /// <summary>
    /// Mã lỗi
    /// </summary>
    /// <remarks>
    /// Lỗi nghiệp vụ lấy code trong phản hồi OpenObserve, nếu không có thì lấy mã trạng thái HTTP
    /// </remarks>
    public int Code => Error?.Code ?? StatusCode;
    /// <summary>
    /// Mã trạng thái HTTP
    /// </summary>
    public int StatusCode { get; }
    /// <summary>
    /// Phản hồi lỗi OpenObserve
    /// </summary>
    public OpenObserveErrorResponse? Error { get; }
    /// <summary>
    /// Nội dung phản hồi gốc
    /// </summary>
    public string? ResponseBody { get; }

    public OpenObserveException(
        string message,
        OpenObserveErrorResponse? error = null,
        int statusCode = 0,
        string? responseBody = null,
        Exception? innerException = null)
        : base(message, innerException)
    {
        Error = error;
        StatusCode = statusCode;
        ResponseBody = responseBody;
    }
}
