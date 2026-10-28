namespace LINGYUN.Abp.OpenObserve.Models.Ingestion;

/// <summary>
/// Ngoại lệ nhập dữ liệu OpenObserve
/// </summary>
public class OpenObserveIngestionException : OpenObserveException
{
    /// <summary>
    /// Tên luồng dữ liệu
    /// </summary>
    public string Stream { get; }

    public OpenObserveIngestionException(
        string stream,
        OpenObserveErrorResponse error,
        int statusCode = 0,
        string? responseBody = null)
        : base(error.Message, error, statusCode, responseBody)
    {
        Stream = stream;
    }
}
