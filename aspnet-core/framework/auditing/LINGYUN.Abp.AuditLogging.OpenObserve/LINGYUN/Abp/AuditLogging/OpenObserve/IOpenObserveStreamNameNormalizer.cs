using System;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Bộ chuẩn hoá tên luồng dữ liệu OpenObserve
/// </summary>
/// <remarks>
/// Tham khảo cách triển khai <c>IIndexNameNormalizer</c> của Elasticsearch: mỗi tenant dùng một luồng dữ liệu khác nhau,
/// tránh dữ liệu của nhiều tenant bị trộn lẫn với nhau
/// </remarks>
public interface IOpenObserveStreamNameNormalizer
{
    /// <summary>
    /// Chuẩn hoá tên luồng dữ liệu (thêm hậu tố tenant)
    /// </summary>
    /// <param name="stream">Tên luồng dữ liệu cơ sở</param>
    /// <param name="tenantId">Định danh tenant, khi trống sẽ dùng tenant hiện tại</param>
    string NormalizeStream(string stream, Guid? tenantId = null);
}
