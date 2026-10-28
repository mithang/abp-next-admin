using Microsoft.Extensions.Diagnostics.HealthChecks;
using StackExchange.Redis;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.MicroService.OpenApi.Gateway.HealthChecks;

// DEVOPS iter-0006 (DEV-11): gateway truoc day khong co endpoint /healthz.
// Gateway khong co co so du lieu nen chi kiem tra Redis — noi DataProtection
// cua gateway phu thuoc (PersistKeysToStackExchangeRedis). Gateway tu tao
// IConnectionMultiplexer tu Redis:Configuration (khong resolve tu DI, vi
// DataProtection khong dang ky multiplexer vao DI); thieu cau hinh ->
// Degraded, khong Unhealthy. Chi tra ve ten loai loi, khong kem
// exception/message (tranh ro ri chuoi ket noi/credential).
public sealed class RedisHealthCheck : IHealthCheck
{
    private readonly string? _configuration;
    private readonly object _lock = new();
    private IConnectionMultiplexer? _multiplexer;

    public RedisHealthCheck(string? configuration)
    {
        _configuration = configuration;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_configuration))
        {
            return HealthCheckResult.Degraded(
                "Redis chua duoc cau hinh (thieu Redis:Configuration) — bo qua kiem tra Redis.");
        }

        try
        {
            IConnectionMultiplexer multiplexer;
            lock (_lock)
            {
                _multiplexer ??= ConnectionMultiplexer.Connect(_configuration);
                multiplexer = _multiplexer;
            }

            var latency = await multiplexer.GetDatabase().PingAsync()
                .WaitAsync(TimeSpan.FromSeconds(5), cancellationToken);
            return HealthCheckResult.Healthy($"Redis phan hoi ping trong {latency.TotalMilliseconds} ms.");
        }
        catch (Exception ex)
        {
            lock (_lock)
            {
                try
                {
                    _multiplexer?.Dispose();
                }
                catch
                {
                    // Bo qua loi dispose khi ket noi da hong.
                }

                _multiplexer = null;
            }

            return HealthCheckResult.Unhealthy($"Kiem tra Redis that bai: {ex.GetType().Name}.");
        }
    }
}
