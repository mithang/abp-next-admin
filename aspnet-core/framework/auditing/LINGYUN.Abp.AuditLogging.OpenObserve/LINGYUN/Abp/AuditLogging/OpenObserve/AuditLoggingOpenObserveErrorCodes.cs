namespace LINGYUN.Abp.AuditLogging.OpenObserve;

public static class AuditLoggingOpenObserveErrorCodes
{
    public const string Namespace = "AuditLoggingOpenObserve";

    /// <summary>
    /// Cơ sở hạ tầng ghi nhật ký hiện tại không hỗ trợ xóa bản ghi!
    /// </summary>
    public const string DeleteNotSupported = Namespace + ":010001";
}
