using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace LINGYUN.Abp.MicroService.AIService.HealthChecks;

// DEVOPS iter-0006 (DEV-11): truoc day /healthz cua host nay dang ky
// AddHealthChecks() tro trui nen luon tra 200 ke ca khi dependency chet
// (bang chung live o devops-0003 cho AllInOne). Hai check duoi day kiem tra
// dependency that, theo dung mau AllInOneHealthChecks.cs, nhung khong cung
// cap DbContext cu the: host nay khong so huu DbContext rieng (DbContext den
// tu cac module ABP no phu thuoc), nen DatabaseHealthCheck quet cac dang ky
// DbContext da co trong IServiceCollection luc ConfigureServices va goi
// CanConnectAsync tren tung cai — khong phu thuoc provider (MySQL/PostgreSQL/
// SQL Server deu dung duoc), khong them package moi.
// - Database: tat ca DbContext quet duoc phai CanConnectAsync trong 10s.
// - Redis: ping qua IConnectionMultiplexer tu tao tu Redis:Configuration
//   (host nay KHONG dang ky IConnectionMultiplexer trong DI nhu AllInOne,
//   nen khong resolve tu DI); thieu cau hinh -> Degraded, khong Unhealthy.
// Ca hai check chi tra ve ten loai loi, khong bao gio kem exception/message
// (tranh ro ri chuoi ket noi/credential vao health response hoac log).
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly IReadOnlyList<Type> _dbContextTypes;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DatabaseHealthCheck>? _logger;
    private bool _discoveryLogged;

    public DatabaseHealthCheck(
        IReadOnlyList<Type> dbContextTypes,
        IServiceScopeFactory scopeFactory,
        ILogger<DatabaseHealthCheck>? logger = null)
    {
        _dbContextTypes = dbContextTypes;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        if (!_discoveryLogged)
        {
            _discoveryLogged = true;
            _logger?.LogInformation(
                "DEV-11: kiem tra co so du lieu quet duoc {Count} DbContext: {Types}",
                _dbContextTypes.Count,
                _dbContextTypes.Count == 0
                    ? "(khong co)"
                    : string.Join(", ", _dbContextTypes.Select(t => t.Name)));
        }

        if (_dbContextTypes.Count == 0)
        {
            return HealthCheckResult.Unhealthy(
                "Khong phat hien DbContext nao duoc dang ky trong DI — kiem tra co so du lieu khong the chay.");
        }

        var healthy = new List<string>();
        var failures = new List<string>();
        foreach (var dbContextType in _dbContextTypes)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetService(dbContextType) as DbContext;
                if (dbContext is null)
                {
                    failures.Add($"{dbContextType.Name}: khong resolve duoc tu DI");
                    continue;
                }

                using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                using var linked = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeout.Token);
                var canConnect = await dbContext.Database.CanConnectAsync(linked.Token);
                if (canConnect)
                {
                    healthy.Add(dbContextType.Name);
                }
                else
                {
                    failures.Add($"{dbContextType.Name}: CanConnectAsync = false");
                }
            }
            catch (Exception ex)
            {
                failures.Add($"{dbContextType.Name}: {ex.GetType().Name}");
            }
        }

        return failures.Count == 0
            ? HealthCheckResult.Healthy($"Tat ca {healthy.Count} DbContext ket noi thanh cong: {string.Join(", ", healthy)}.")
            : HealthCheckResult.Unhealthy($"Co so du lieu khong dat: {string.Join("; ", failures)}.");
    }
}

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
