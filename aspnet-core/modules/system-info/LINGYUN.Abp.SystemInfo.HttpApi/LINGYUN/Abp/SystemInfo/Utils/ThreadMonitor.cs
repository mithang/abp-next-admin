using System.Diagnostics;
using System.Threading;

namespace LINGYUN.Abp.SystemInfo.Utils;

public class ThreadMetrics
{
    /// <summary>
    /// Số luồng worker khả dụng
    /// </summary>
    public int AvailableWorkerThreads { get; set; }
    /// <summary>
    /// Số luồng I/O khả dụng
    /// </summary>
    public int AvailableCompletionPortThreads { get; set; }
    /// <summary>
    /// Số luồng worker tối đa
    /// </summary>
    public int MaxWorkerThreads { get; set; }
    /// <summary>
    /// Số luồng I/O tối đa
    /// </summary>
    public int MaxCompletionPortThreads { get; set; }
    /// <summary>
    /// Tổng số luồng của tiến trình
    /// </summary>
    public int ActiveThreads { get; set; }
    /// <summary>
    /// Số luồng đang hoạt động của thread pool
    /// </summary>
    public int ThreadPoolThreadCount { get; set; }
}

public class ThreadMonitor
{
    public ThreadMetrics GetThreadMetrics()
    {
        ThreadPool.GetAvailableThreads(
            out var availableWorkerThreads,
            out var availableCompletionPortThreads);
        ThreadPool.GetMaxThreads(
            out var maxWorkerThreads,
            out var maxCompletionPortThreads);

        // Lấy số luồng của tiến trình (xấp xỉ số luồng đang hoạt động)
        var process = Process.GetCurrentProcess();
        var threads = process.Threads;

        return new ThreadMetrics
        {
            AvailableWorkerThreads = availableWorkerThreads,
            AvailableCompletionPortThreads = availableCompletionPortThreads,
            MaxWorkerThreads = maxWorkerThreads,
            MaxCompletionPortThreads = maxCompletionPortThreads,
            ActiveThreads = threads.Count,
            ThreadPoolThreadCount = ThreadPool.ThreadCount
        };
    }
}
