using System.Net.Http;

namespace LINGYUN.Abp.OpenObserve.Models;

/// <summary>
/// Ngoại lệ yêu cầu OpenObserve
/// </summary>
/// <remarks>
/// Được ném khi nội dung phản hồi không thể phân tích thành phản hồi lỗi chuẩn của OpenObserve
/// </remarks>
public class OpenObserveRequestException : OpenObserveException
{
    public HttpResponseMessage HttpResponseMessage { get; }

    public OpenObserveRequestException(
        HttpResponseMessage responseMessage,
        string? responseBody = null)
        : base(
            $"OpenObserve request failed with status code {(int)responseMessage.StatusCode} ({responseMessage.ReasonPhrase})",
            null,
            (int)responseMessage.StatusCode,
            responseBody)
    {
        HttpResponseMessage = responseMessage;
    }
}
