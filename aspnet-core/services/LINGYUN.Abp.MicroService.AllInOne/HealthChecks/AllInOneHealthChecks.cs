using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace LINGYUN.Abp.MicroService.AllInOne.HealthChecks;

// DEVOPS iter-0004 (DEV-11): trước đây /healthz đăng ký AddHealthChecks() trơ trụi,
// không có check nào nên luôn trả 200 "Healthy" kể cả khi PostgreSQL và Redis đều chết
// (bằng chứng live ở vòng devops-0003). Hai check dưới đây kiểm tra dependency thật
// bằng API đã có sẵn trong project, không thêm package mới:
// - Database: PlatformDbContext.Database.CanConnectAsync() (EF Core, provider nào cũng dùng được).
// - Redis: IConnectionMultiplexer đã đăng ký singleton sẵn trong ConfigureCaching, PingAsync().
// Cả hai đều resolve lazy trong CheckHealthAsync để khi dependency chết thì endpoint trả
// 503 Unhealthy thay vì 500 do constructor ném exception.
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly IServiceScopeFactory _scopeFactory;

    public DatabaseHealthCheck(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PlatformDbContext>();
            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));
            using var linked = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeout.Token);
            var canConnect = await dbContext.Database.CanConnectAsync(linked.Token);
            return canConnect
                ? HealthCheckResult.Healthy("Kết nối cơ sở dữ liệu thành công.")
                : HealthCheckResult.Unhealthy("Không kết nối được cơ sở dữ liệu.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Kiểm tra cơ sở dữ liệu thất bại.", ex);
        }
    }
}

public class RedisHealthCheck : IHealthCheck
{
    private readonly IServiceScopeFactory _scopeFactory;

    public RedisHealthCheck(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var multiplexer = scope.ServiceProvider.GetRequiredService<IConnectionMultiplexer>();
            var database = multiplexer.GetDatabase();
            var latency = await database.PingAsync().WaitAsync(TimeSpan.FromSeconds(5), cancellationToken);
            return HealthCheckResult.Healthy($"Redis phản hồi ping trong {latency.TotalMilliseconds} ms.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Kiểm tra Redis thất bại.", ex);
        }
    }
}
