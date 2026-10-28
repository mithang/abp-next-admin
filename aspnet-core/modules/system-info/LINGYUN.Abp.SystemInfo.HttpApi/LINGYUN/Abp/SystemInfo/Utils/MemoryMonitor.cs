using System;
using System.Diagnostics;

namespace LINGYUN.Abp.SystemInfo.Utils;

public class MemoryMetrics
{
    /// <summary>
    /// Tổng bộ nhớ vật lý
    /// </summary>
    public long TotalMemory { get; set; }
    /// <summary>
    /// Bộ nhớ working set
    /// </summary>
    public long WorkingSet { get; set; }
    /// <summary>
    /// Bộ nhớ riêng tư
    /// </summary>
    public long PrivateMemory { get; set; }
    /// <summary>
    /// Bộ nhớ ảo
    /// </summary>
    public long VirtualMemory { get; set; }
    /// <summary>
    /// Kích thước heap GC
    /// </summary>
    public long GCHeapSize { get; set; }
}

public class MemoryMonitor
{
    // Chuyển đổi sang MB
    const long MB = 1024 * 1024;

    public MemoryMetrics GetMemoryMetrics()
    {
        var process = Process.GetCurrentProcess();

        return new MemoryMetrics
        {
            TotalMemory = GC.GetTotalMemory(false) / MB,  
            WorkingSet = process.WorkingSet64 / MB,
            PrivateMemory = process.PrivateMemorySize64 / MB,
            VirtualMemory = process.VirtualMemorySize64 / MB,
            GCHeapSize = GetGCHeapSize() / MB
        };
    }

    private long GetGCHeapSize()
    {
        var gcInfo = GC.GetGCMemoryInfo();
        return (long)gcInfo.HeapSizeBytes;
    }
}
