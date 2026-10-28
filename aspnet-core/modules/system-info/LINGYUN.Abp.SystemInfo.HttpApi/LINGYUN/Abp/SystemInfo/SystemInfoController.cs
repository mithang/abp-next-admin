using DotNetCore.CAP;
using LINGYUN.Abp.SystemInfo.Models;
using LINGYUN.Abp.SystemInfo.Permissions;
using LINGYUN.Abp.SystemInfo.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;

namespace LINGYUN.Abp.SystemInfo;

[Controller]
[Route("api/system-info")]
[Authorize(SystemInfoPermissions.Default)]
public class SystemInfoController : AbpControllerBase
{
    [HttpGet]
    public async virtual Task<SystemInfoModel> GetSystemInfoAsync()
    {
        return new SystemInfoModel
        {
            Components = new ComponentInfoModel[]
            {
                GetSystemInfo(),
                GetPerformanceInfo(),
                GetRedisInfo(),
                GetCapInfo(),
            },
        };
    }

    private ComponentInfoModel GetSystemInfo()
    {
        var env = HttpContext.RequestServices.GetService<IHostEnvironment>();
        using var process = Process.GetCurrentProcess();

        var systemKeys = new List<ComponentKeyModel>
        {
            new ComponentKeyModel("sys_machine_name", "Tên máy"),
            new ComponentKeyModel("sys_environment", "Môi trường chạy"),
            new ComponentKeyModel("sys_framework_version", "Phiên bản .NET"),
            new ComponentKeyModel("sys_os_version", "Phiên bản hệ điều hành"),
            new ComponentKeyModel("sys_app_db_provider", "Cơ sở dữ liệu"),
            new ComponentKeyModel("sys_app_version", "Phiên bản ứng dụng"),
            new ComponentKeyModel("sys_app_build_time", "Thời gian biên dịch"),
            new ComponentKeyModel("sys_app_start_time", "Thời gian khởi động"),
        };

        var systemDetails = new Dictionary<string, object?>
        {
            { "sys_machine_name", Environment.MachineName },
            { "sys_environment", env?.EnvironmentName ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") },
            { "sys_framework_version", RuntimeInformation.FrameworkDescription },
            { "sys_os_version", RuntimeInformation.OSDescription },
            { "sys_app_db_provider", Environment.GetEnvironmentVariable("APPLICATION_DATABASE_PROVIDER") },
            { "sys_app_start_time", process.StartTime.ToString("yyyy-MM-dd HH:mm:ss") },
        };

        try
        {
            var assembly = Assembly.GetEntryAssembly() ?? Assembly.GetExecutingAssembly();
            var fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
            var assemblyName = assembly.GetName();
            var buildTime = GetBuildTime(assembly);

            systemDetails.Add("sys_app_version", fileVersionInfo.FileVersion ?? assemblyName.Version?.ToString() ?? "N/A");
            systemDetails.Add("sys_app_build_time", buildTime.HasValue ? buildTime.Value.ToString("yyyy-MM-dd HH:mm:ss") : "N/A");
        }
        catch
        {
            systemDetails.Add("sys_app_version", "N/A");
            systemDetails.Add("sys_app_build_time", "N/A");
        }

        return new ComponentInfoModel("Hệ thống", systemKeys.ToArray(), systemDetails);
    }

    private ComponentInfoModel GetPerformanceInfo()
    {
        using var process = Process.GetCurrentProcess();

        var memoryMetrics = new MemoryMonitor().GetMemoryMetrics();
        var threadMetrics = new ThreadMonitor().GetThreadMetrics();
        var gcMetrics = new GCMonitor().GetGCMetrics();

        return new ComponentInfoModel(
            "Hiệu năng",
            new ComponentKeyModel[]
            {
                new ComponentKeyModel("perf_total_memory", "Tổng bộ nhớ (MB)"),
                new ComponentKeyModel("perf_working_set", "Bộ nhớ working set (MB)"),
                new ComponentKeyModel("perf_private_memory", "Bộ nhớ riêng tư (MB)"),
                new ComponentKeyModel("perf_gc_heap_size", "Kích thước heap GC (MB)"),
                new ComponentKeyModel("perf_gc0", "Số lần thu gom Gen0"),
                new ComponentKeyModel("perf_gc1", "Số lần thu gom Gen1"),
                new ComponentKeyModel("perf_gc2", "Số lần thu gom Gen2"),
                new ComponentKeyModel("perf_active_total_memory", "Tổng bộ nhớ khả dụng"),
                new ComponentKeyModel("perf_memory_load", "Tải bộ nhớ"),
                new ComponentKeyModel("perf_fragmented_bytes", "Kích thước phân mảnh bộ nhớ"),
                new ComponentKeyModel("perf_available_worker_threads", "Số luồng làm việc khả dụng"),
                new ComponentKeyModel("perf_available_completion_port_threads", "Số luồng I/O khả dụng"),
                new ComponentKeyModel("perf_max_worker_threads", "Số luồng làm việc tối đa"),
                new ComponentKeyModel("perf_max_completion_port_threads", "Số luồng I/O tối đa"),
                new ComponentKeyModel("perf_active_threads", "Tổng số luồng của tiến trình"),
                new ComponentKeyModel("perf_thread_pool_thread_count", "Số luồng đang hoạt động của thread pool"),
            },
            new Dictionary<string, object?>
            {
                { "perf_total_memory", memoryMetrics.TotalMemory },
                { "perf_working_set", memoryMetrics.WorkingSet },
                { "perf_private_memory", memoryMetrics.PrivateMemory },
                { "perf_gc_heap_size", memoryMetrics.GCHeapSize },
                { "perf_gc0", gcMetrics.Gen0Collections },
                { "perf_gc1", gcMetrics.Gen1Collections },
                { "perf_gc2", gcMetrics.Gen2Collections },
                { "perf_active_total_memory", gcMetrics.TotalMemory },
                { "perf_memory_load", gcMetrics.MemoryLoad },
                { "perf_fragmented_bytes", gcMetrics.FragmentedBytes },
                { "perf_available_worker_threads", threadMetrics.AvailableWorkerThreads },
                { "perf_available_completion_port_threads", threadMetrics.AvailableCompletionPortThreads },
                { "perf_max_worker_threads", threadMetrics.MaxWorkerThreads },
                { "perf_max_completion_port_threads", threadMetrics.MaxCompletionPortThreads },
                { "perf_active_threads", threadMetrics.ActiveThreads },
                { "perf_thread_pool_thread_count", threadMetrics.ThreadPoolThreadCount },
            });
    }

    private ComponentInfoModel GetCapInfo()
    {
        var cap = HttpContext.RequestServices.GetService<CapMarkerService>();
        var storage = HttpContext.RequestServices.GetService<CapStorageMarkerService>();
        var broker = HttpContext.RequestServices.GetService<CapMessageQueueMakerService>();

        var capKeys = new List<ComponentKeyModel>
        {
            new ComponentKeyModel("cap_status", "Trạng thái"),
            new ComponentKeyModel("cap_version", "Phiên bản"),
            new ComponentKeyModel("cap_storage", "Lưu trữ bền vững"),
            new ComponentKeyModel("cap_transport", "Truyền tải"),
        };
        var capDetails = new Dictionary<string, object?>
        {
            { "cap_status", cap != null ? "Bình thường" : "Chưa bật" },
            { "cap_version", cap != null ? cap.Version.Substring(0, 5) : "N/A" },
            { "cap_storage", storage != null ? storage.Name : "N/A" },
            { "cap_transport", broker != null ? broker.Name : "N/A" }
        };

        return new ComponentInfoModel("Thành phần CAP", capKeys.ToArray(), capDetails);
    }

    private ComponentInfoModel GetRedisInfo()
    {
        var redis = HttpContext.RequestServices.GetService<IConnectionMultiplexer>();
        if (redis == null)
        {
            return new ComponentInfoModel(
                "Thành phần Redis",
                new ComponentKeyModel[]
                {
                    new ComponentKeyModel("redis_status", "Trạng thái")
                },
                new Dictionary<string, object?>
                {
                    { "redis_status", "Chưa đăng ký" },
                });
        }
        var redisInfo = new Dictionary<string, string>();

        try
        {
            var server = redis.GetServer(redis.GetEndPoints().First());
            var serverInfo = server.Info();
            foreach (var section in serverInfo)
            {
                foreach (var item in section)
                {
                    redisInfo[item.Key] = item.Value;
                }
            }
        }
        catch(Exception ex)
        {
            Logger.LogWarning("There is an exception in connecting to the redis server: {message}", ex.Message);

            return new ComponentInfoModel(
                "Thành phần Redis",
                new ComponentKeyModel[]
                {
                    new ComponentKeyModel("redis_status", "Trạng thái")
                },
                new Dictionary<string, object?>
                {
                    { "redis_status", "Lỗi kết nối" },
                });
        }

        var uptimeSeconds = redisInfo.ContainsKey("uptime_in_seconds") ? long.Parse(redisInfo["uptime_in_seconds"]) : 0;
        var days = Math.Floor((double)uptimeSeconds / 86400);
        var hours = Math.Floor((double)uptimeSeconds % 86400 / 3600);
        var minutes = Math.Floor((double)uptimeSeconds % 3600 / 60);

        var usedMemory = redisInfo.ContainsKey("used_memory") ? long.Parse(redisInfo["used_memory"]) : 0;
        var maxMemory = redisInfo.ContainsKey("maxmemory") ? long.Parse(redisInfo["maxmemory"]) : 0;
        var totalKeys = CalculateTotalKeys(redisInfo);
        var expiresKeys = CalculateExpires(redisInfo);
        var avgTtl = CalculateAvgTtl(redisInfo);

        var redisKeys = new List<ComponentKeyModel>()
        {
            new ComponentKeyModel("redis_version", "Phiên bản"),
            new ComponentKeyModel("redis_mode", "Chế độ chạy"),
            new ComponentKeyModel("redis_os", "Hệ điều hành"),
            new ComponentKeyModel("redis_uptime", "Thời gian chạy"),
            new ComponentKeyModel("redis_used_cpu_sys", "Thời gian sử dụng CPU hệ thống"),
            new ComponentKeyModel("redis_used_cpu_user", "Thời gian sử dụng CPU người dùng"),
            new ComponentKeyModel("redis_used_memory_mb", "Bộ nhớ đã dùng (MB)"),
            new ComponentKeyModel("redis_used_memory_rss_mb", "Bộ nhớ vật lý (MB)"),
            new ComponentKeyModel("redis_used_memory_peak_mb", "Đỉnh sử dụng bộ nhớ (MB)"),
            new ComponentKeyModel("redis_maxmemory_mb", "Giới hạn bộ nhớ tối đa (MB)"),
            new ComponentKeyModel("redis_memory_usage_percent", "Tỷ lệ sử dụng bộ nhớ (%)"),
            new ComponentKeyModel("redis_mem_fragmentation_ratio", "Tỷ lệ phân mảnh bộ nhớ"),
            new ComponentKeyModel("redis_connected_clients", "Số client đã kết nối"),
            new ComponentKeyModel("redis_blocked_clients", "Số client bị chặn"),
            new ComponentKeyModel("redis_client_longest_output_list", "Danh sách đầu ra dài nhất của client"),
            new ComponentKeyModel("redis_client_biggest_input_buf", "Bộ đệm đầu vào lớn nhất của client"),
            new ComponentKeyModel("redis_maxclients", "Số client tối đa"),
            new ComponentKeyModel("redis_total_keys", "Tổng số khóa"),
            new ComponentKeyModel("redis_expires_keys", "Số khóa đã đặt hết hạn"),
            new ComponentKeyModel("redis_expired_keys", "Số khóa đã hết hạn"),
            new ComponentKeyModel("redis_evicted_keys", "Số khóa bị loại bỏ"),
            new ComponentKeyModel("redis_avg_ttl_seconds", "TTL trung bình (giây)"),
        };
        var redisDetails = new Dictionary<string, object?>()
        {
            { "redis_version", redisInfo.GetValueOrDefault("redis_version", "unknown") },
            { "redis_mode", redisInfo.GetValueOrDefault("redis_mode", "unknown") },
            { "redis_os", redisInfo.GetValueOrDefault("os", "unknown") },
            { "redis_uptime", $"{days} ngày {hours} giờ {minutes} phút" },
            { "redis_used_cpu_sys", redisInfo.GetValueOrDefault("used_cpu_sys", "0") },
            { "redis_used_cpu_user", redisInfo.GetValueOrDefault("used_cpu_user", "0") },
            { "redis_used_memory_mb", Math.Round((double)usedMemory / 1024 / 1024, 2) },
            { "redis_used_memory_rss_mb", redisInfo.ContainsKey("used_memory_rss") ?
                    Math.Round(double.Parse(redisInfo["used_memory_rss"]) / 1024 / 1024, 2) : 0 },
            { "redis_used_memory_peak_mb", redisInfo.ContainsKey("used_memory_peak") ?
                    Math.Round(double.Parse(redisInfo["used_memory_peak"]) / 1024 / 1024, 2) : 0 },
            { "redis_maxmemory_mb", maxMemory > 0 ? Math.Round((double)maxMemory / 1024 / 1024, 2) : 0 },
            { "redis_memory_usage_percent", maxMemory > 0 ? Math.Round((double)usedMemory / maxMemory * 100, 2) : 0 },
            { "redis_mem_fragmentation_ratio", redisInfo.GetValueOrDefault("mem_fragmentation_ratio", "0") },
            { "redis_connected_clients", redisInfo.GetValueOrDefault("connected_clients", "0") },
            { "redis_blocked_clients", redisInfo.GetValueOrDefault("blocked_clients", "0") },
            { "redis_client_longest_output_list", redisInfo.GetValueOrDefault("client_longest_output_list", "0") },
            { "redis_client_biggest_input_buf", redisInfo.GetValueOrDefault("client_biggest_input_buf", "0") },
            { "redis_maxclients", redisInfo.GetValueOrDefault("maxclients", "unlimited") },
            { "redis_total_keys", totalKeys },
            { "redis_expires_keys", expiresKeys },
            { "redis_expired_keys", redisInfo.GetValueOrDefault("expired_keys", "0") },
            { "redis_evicted_keys", redisInfo.GetValueOrDefault("evicted_keys", "0") },
            { "redis_avg_ttl_seconds", avgTtl },
        };

        return new ComponentInfoModel("Thành phần Redis", redisKeys.ToArray(), redisDetails);
    }

    private long CalculateTotalKeys(Dictionary<string, string> redisInfo)
    {
        long total = 0;

        foreach (var item in redisInfo)
        {
            if (item.Key.StartsWith("db"))
            {
                var keysPart = item.Value.Split(',').FirstOrDefault(x => x.StartsWith("keys="));
                if (keysPart != null && long.TryParse(keysPart.Split('=')[1], out var count))
                {
                    total += count;
                }
            }
        }

        return total;
    }

    private long CalculateExpires(Dictionary<string, string> redisInfo)
    {
        long expires = 0;

        foreach (var item in redisInfo)
        {
            if (item.Key.StartsWith("db"))
            {
                var expiresPart = item.Value.Split(',').FirstOrDefault(x => x.StartsWith("expires="));
                if (expiresPart != null && long.TryParse(expiresPart.Split('=')[1], out var count))
                {
                    expires += count;
                }
            }
        }

        return expires;
    }

    private long CalculateAvgTtl(Dictionary<string, string> redisInfo)
    {
        long totalTtl = 0;
        long dbCount = 0;

        foreach (var item in redisInfo)
        {
            if (item.Key.StartsWith("db"))
            {
                var ttlPart = item.Value.Split(',').FirstOrDefault(x => x.StartsWith("avg_ttl="));
                if (ttlPart != null && long.TryParse(ttlPart.Split('=')[1], out var ttl) && ttl > 0)
                {
                    totalTtl += ttl;
                    dbCount++;
                }
            }
        }

        return dbCount > 0 ? totalTtl / dbCount : -1;
    }

    private DateTime? GetBuildTime(Assembly assembly)
    {
        try
        {
            var attribute = assembly.GetCustomAttribute<AssemblyMetadataAttribute>();
            if (attribute != null && attribute.Key == "BuildTimestamp")
            {
                if (DateTime.TryParse(attribute.Value, out var buildTime))
                {
                    return buildTime;
                }
            }

            var fileInfo = new FileInfo(assembly.Location);
            if (fileInfo.Exists)
            {
                return fileInfo.LastWriteTime;
            }

            return null;
        }
        catch
        {
            return null;
        }
    }
}
