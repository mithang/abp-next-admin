using System;
using System.Collections.Generic;
using System.Threading;

namespace LINGYUN.Abp.BackgroundTasks;

public class JobEventData
{
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public Type Type { get; }
    /// <summary>
    /// Tham số tác vụ
    /// </summary>
    public IReadOnlyDictionary<string, object> Args { get; }
    /// <summary>
    /// Nhóm tác vụ
    /// </summary>
    public string Group { get; }
    /// <summary>
    /// Tên tác vụ
    /// </summary>
    public string Name { get; }
    /// <summary>
    /// Mã định danh tác vụ
    /// </summary>
    public string Key { get; }
    /// <summary>
    /// Trạng thái tác vụ
    /// </summary>
    public JobStatus Status { get; set; }
    /// <summary>
    /// Tenant thực thi
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Chi tiết lỗi
    /// </summary>
    public Exception? Exception { get; }
    /// <summary>
    /// Mô tả tác vụ
    /// </summary>
    public string? Description { get; set; }
    /// <summary>
    /// Tham số trả về
    /// </summary>
    public string? Result { get; set; }
    /// <summary>
    /// Số lần kích hoạt
    /// </summary>
    public int Triggered { get; set; }
    /// <summary>
    /// Số lần thực thi tối đa
    /// </summary>
    public int RepeatCount { get; set; }
    /// <summary>
    /// Thời gian chạy
    /// </summary>
    public DateTime RunTime { get; set; }
    /// <summary>
    /// Thời gian thực thi (ms)
    /// </summary>
    public int? ExecutionDuration { get; set; }
    /// <summary>
    /// Thời gian chạy lần trước
    /// </summary>
    public DateTime? LastRunTime { get; set; }
    /// <summary>
    /// Thời gian chạy lần tới
    /// </summary>
    public DateTime? NextRunTime { get; set; }
    /// <summary>
    /// Token hủy công việc
    /// </summary>
    public CancellationToken CancellationToken { get; }
    public JobEventData(
        string key,
        Type type, 
        string group, 
        string name,
        IReadOnlyDictionary<string, object> args,
        Exception? exception = null,
        CancellationToken cancellationToken = default)
    {
        Key = key;
        Type = type;
        Group = group;
        Name = name;
        Args = args;
        Exception = exception;
        CancellationToken = cancellationToken;
    }
}
