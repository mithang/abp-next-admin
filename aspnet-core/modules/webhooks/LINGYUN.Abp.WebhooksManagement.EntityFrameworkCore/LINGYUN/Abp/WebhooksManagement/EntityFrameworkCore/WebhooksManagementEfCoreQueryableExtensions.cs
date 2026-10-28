using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LINGYUN.Abp.WebhooksManagement.EntityFrameworkCore;

public static class WebhooksManagementEfCoreQueryableExtensions
{
    // Phương thức mở rộng của dịch vụ kho tổng hợp này
    public static IQueryable<WebhookSendRecord> IncludeDetails(this IQueryable<WebhookSendRecord> queryable, bool include = true)
    {
        if (!include)
        {
            return queryable;
        }

        return queryable
            .Include(x => x.WebhookEvent);
    }
}
