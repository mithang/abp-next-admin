namespace LINGYUN.Abp.OpenObserve.Models;

public static class OpenObserveConstants
{
    /// <summary>
    /// Thời gian chờ mặc định của giao diện tìm kiếm (giây)
    /// </summary>
    public const int ZO_QUERY_TIMEOUT = 30;
    /// <summary>
    /// Điểm cuối mặc định
    /// </summary>
    public const string DefaultEndpoint = "http://localhost:5080";
    /// <summary>
    /// Thời gian chờ yêu cầu mặc định
    /// </summary>
    public const int DefaultTimeoutSeconds = 30;
    /// <summary>
    /// Tên tổ chức mặc định
    /// </summary>
    public const string DefaultOrganization = "default";
    /// <summary>
    /// Tên tổ chức siêu dữ liệu
    /// </summary>
    /// <remarks>
    /// Các giao diện như thông tin cụm chỉ mở cho tổ chức _meta
    /// </remarks>
    public const string MetaOrganization = "_meta";
    /// <summary>
    /// Kiểu nội dung JSON
    /// </summary>
    public const string JsonContentType = "application/json";
    /// <summary>
    /// Kiểu nội dung NDJSON
    /// </summary>
    /// <remarks>
    /// Dùng cho giao diện _bulk và _multi (mỗi dòng một đối tượng JSON)
    /// </remarks>
    public const string NdJsonContentType = "application/x-ndjson";

    /// <summary>
    /// Loại luồng dữ liệu
    /// </summary>
    public static class StreamTypes
    {
        public const string Logs = "logs";
        public const string Metrics = "metrics";
        public const string Traces = "traces";
    }

    /// <summary>
    /// Các hành động được _bulk hỗ trợ
    /// </summary>
    /// <remarks>
    /// delete không được hỗ trợ
    /// </remarks>
    public static class BulkActions
    {
        public const string Index = "index";
        public const string Create = "create";
        public const string Update = "update";
    }

    /// <summary>
    /// Thư mục mặc định
    /// </summary>
    public const string DefaultFolder = "default";
}
