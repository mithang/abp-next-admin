using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Cluster;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Thông tin cụm
    /// </summary>
    /// <remarks>
    /// Trả về số tác vụ nén đang chờ xử lý của từng khu vực, từng nút
    /// Thực tế API này chỉ mở cho tổ chức _meta, dùng tổ chức khác sẽ trả về 403 "This API is only available for the _meta organization",
    /// vì vậy organization mặc định lấy _meta
    /// Đường dẫn tài liệu đưa ra là GET /api/{org_id}/cluster_info, thực tế trả về 404, đường dẫn thực tế là GET /api/{org_id}/cluster/info
    /// Tham khảo: https://openobserve.ai/docs/reference/api/cluster/cluster-info/
    /// </remarks>
    public async virtual Task<ClusterInfoResponse> GetClusterInfoAsync(
        string? organization = OpenObserveConstants.MetaOrganization,
        CancellationToken cancellationToken = default)
    {
        var requestUri = CreateClusterInfoRequestUri(ResolveOrganization(organization));

        return (await GetAsync<ClusterInfoResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Tạo địa chỉ yêu cầu thông tin cụm
    /// </summary>
    /// <remarks>
    /// Đường dẫn của tài liệu và của triển khai không khớp nhau, khi cần tương thích hãy ghi đè phương thức này
    /// </remarks>
    protected virtual string CreateClusterInfoRequestUri(string organization)
    {
        return $"/api/{organization}/cluster/info";
    }
}
